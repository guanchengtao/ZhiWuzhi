/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'richcombo',
{
	requires : [ 'floatpanel', 'listblock', 'button' ],

	beforeInit : function( editor )
	{
		editor.ui.addHandler( CKeDITOR.UI_RICHCOMBO, CKeDITOR.ui.richCombo.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
CKeDITOR.UI_RICHCOMBO = 'richcombo';

CKeDITOR.ui.richCombo = CKeDITOR.tools.createClass(
{
	$ : function( definition )
	{
		// Copy all definition properties to this object.
		CKeDITOR.tools.extend( this, definition,
			// Set defaults.
			{
				title : definition.label,
				modes : { wysiwyg : 1 }
			});

		// We don't want the panel definition in this object.
		var panelDefinition = this.panel || {};
		delete this.panel;

		this.id = CKeDITOR.tools.getNextNumber();

		this.document = ( panelDefinition
							&& panelDefinition.parent
							&& panelDefinition.parent.getDocument() )
						|| CKeDITOR.document;

		panelDefinition.className = ( panelDefinition.className || '' ) + ' cKe_rcombopanel';
		panelDefinition.block =
		{
			multiSelect : panelDefinition.multiSelect,
			attributes : panelDefinition.attributes
		};

		this._ =
		{
			panelDefinition : panelDefinition,
			items : {},
			state : CKeDITOR.TRISTATE_OFF
		};
	},

	statics :
	{
		handler :
		{
			create : function( definition )
			{
				return new CKeDITOR.ui.richCombo( definition );
			}
		}
	},

	proto :
	{
		renderHtml : function( editor )
		{
			var output = [];
			this.render( editor, output );
			return output.join( '' );
		},

		/**
		 * Renders the combo.
		 * @param {CKeDITOR.editor} editor The editor instance which this button is
		 *		to be used by.
		 * @param {Array} output The output array to which append the HTML relative
		 *		to this button.
		 * @example
		 */
		render : function( editor, output )
		{
			var env = CKeDITOR.env;

			var id = 'cKe_' + this.id;
			var clickFn = CKeDITOR.tools.addFunction( function( $element )
				{
					var _ = this._;

					if ( _.state == CKeDITOR.TRISTATE_DISABLED )
						return;

					this.createPanel( editor );

					if ( _.on )
					{
						_.panel.hide();
						return;
					}

					this.commit();
					var value = this.getValue();
					if ( value )
						_.list.mark( value );
					else
						_.list.unmarkAll();

					_.panel.showBlock( this.id, new CKeDITOR.dom.element( $element ), 4 );
				},
				this );

			var instance = {
				id : id,
				combo : this,
				focus : function()
				{
					var element = CKeDITOR.document.getById( id ).getChild( 1 );
					element.focus();
				},
				clickFn : clickFn
			};

			function updateState()
			{
				var state = this.modes[ editor.mode ] ? CKeDITOR.TRISTATE_OFF : CKeDITOR.TRISTATE_DISABLED;
				this.setState( editor.readOnly && !this.readOnly ? CKeDITOR.TRISTATE_DISABLED : state );
				this.setValue( '' );
			}

			editor.on( 'mode', updateState, this );
			// If this combo is sensitive to readOnly state, update it accordingly.
			!this.readOnly && editor.on( 'readOnly', updateState, this);

			var KeyDownFn = CKeDITOR.tools.addFunction( function( ev, element )
				{
					ev = new CKeDITOR.dom.event( ev );

					var KeystroKe = ev.getKeystroKe();
					switch ( KeystroKe )
					{
						case 13 :	// ENTER
						case 32 :	// SPACE
						case 40 :	// ARROW-DOWN
							// Show panel
							CKeDITOR.tools.callFunction( clickFn, element );
							break;
						default :
							// Delegate the default behavior to toolbar button Key handling.
							instance.onKey( instance,  KeystroKe );
					}

					// Avoid subsequent focus grab on editor document.
					ev.preventDefault();
				});

			// For clean up
			instance.KeyDownFn = KeyDownFn;

			output.push(
				'<span class="cKe_rcombo" role="presentation">',
				'<span id=', id );

			if ( this.className )
				output.push( ' class="', this.className, ' cKe_off"');

			output.push(
				' role="presentation">',
					'<span id="' + id+ '_label" class=cKe_label>', this.label, '</span>',
					'<a hidefocus=true title="', this.title, '" tabindex="-1"',
						env.gecko && env.version >= 10900 && !env.hc ? '' : ' href="javascript:void(\'' + this.label + '\')"',
						' role="button" aria-labelledby="', id , '_label" aria-describedby="', id, '_text" aria-haspopup="true"' );

			// Some browsers don't cancel Key events in the Keydown but in the
			// Keypress.
			// TODO: Check if really needed for Gecko+Mac.
			if ( CKeDITOR.env.opera || ( CKeDITOR.env.gecko && CKeDITOR.env.mac ) )
			{
				output.push(
					' onKeypress="return false;"' );
			}

			// With Firefox, we need to force it to redraw, otherwise it
			// will remain in the focus state.
			if ( CKeDITOR.env.gecko )
			{
				output.push(
					' onblur="this.style.cssText = this.style.cssText;"' );
			}

			output.push(
					' onKeydown="CKeDITOR.tools.callFunction( ', KeyDownFn, ', event, this );"' +
					' onclick="CKeDITOR.tools.callFunction(', clickFn, ', this); return false;">' +
						'<span>' +
							'<span id="' + id + '_text" class="cKe_text cKe_inline_label">' + this.label + '</span>' +
						'</span>' +
						'<span class=cKe_openbutton><span class=cKe_icon>' + ( CKeDITOR.env.hc ? '&#9660;' : CKeDITOR.env.air ?  '&nbsp;' : '' ) + '</span></span>' +	// BLACK DOWN-POINTING TRIANGLE
					'</a>' +
				'</span>' +
				'</span>' );

			if ( this.onRender )
				this.onRender();

			return instance;
		},

		createPanel : function( editor )
		{
			if ( this._.panel )
				return;

			var panelDefinition = this._.panelDefinition,
				panelBlockDefinition = this._.panelDefinition.block,
				panelParentElement = panelDefinition.parent || CKeDITOR.document.getBody(),
				panel = new CKeDITOR.ui.floatPanel( editor, panelParentElement, panelDefinition ),
				list = panel.addListBlock( this.id, panelBlockDefinition ),
				me = this;

			panel.onShow = function()
				{
					if ( me.className )
						this.element.getFirst().addClass( me.className + '_panel' );

					me.setState( CKeDITOR.TRISTATE_ON );

					list.focus( !me.multiSelect && me.getValue() );

					me._.on = 1;

					if ( me.onOpen )
						me.onOpen();
				};

			panel.onHide = function( preventOnClose )
				{
					if ( me.className )
						this.element.getFirst().removeClass( me.className + '_panel' );

					me.setState( me.modes && me.modes[ editor.mode ] ? CKeDITOR.TRISTATE_OFF : CKeDITOR.TRISTATE_DISABLED );

					me._.on = 0;

					if ( !preventOnClose && me.onClose )
						me.onClose();
				};

			panel.onEscape = function()
				{
					panel.hide();
					me.document.getById( 'cKe_' + me.id ).getFirst().getNext().focus();
				};

			list.onClick = function( value, marKed )
				{
					// Move the focus to the main windows, otherwise it will stay
					// into the floating panel, even if invisible, and Safari and
					// Opera will go a bit crazy.
					me.document.getWindow().focus();

					if ( me.onClick )
						me.onClick.call( me, value, marKed );

					if ( marKed )
						me.setValue( value, me._.items[ value ] );
					else
						me.setValue( '' );

					panel.hide();
				};

			this._.panel = panel;
			this._.list = list;

			panel.getBlock( this.id ).onHide = function()
				{
					me._.on = 0;
					me.setState( CKeDITOR.TRISTATE_OFF );
				};

			if ( this.init )
				this.init();
		},

		setValue : function( value, text )
		{
			this._.value = value;

			var textElement = this.document.getById( 'cKe_' + this.id + '_text' );
			if ( textElement )
			{
				if ( !( value || text ) )
				{
					text = this.label;
					textElement.addClass( 'cKe_inline_label' );
				}
				else
					textElement.removeClass( 'cKe_inline_label' );

				textElement.setHtml( typeof text != 'undefined' ? text : value );
			}
		},

		getValue : function()
		{
			return this._.value || '';
		},

		unmarkAll : function()
		{
			this._.list.unmarkAll();
		},

		mark : function( value )
		{
			this._.list.mark( value );
		},

		hideItem : function( value )
		{
			this._.list.hideItem( value );
		},

		hideGroup : function( groupTitle )
		{
			this._.list.hideGroup( groupTitle );
		},

		showAll : function()
		{
			this._.list.showAll();
		},

		add : function( value, html, text )
		{
			this._.items[ value ] = text || value;
			this._.list.add( value, html, text );
		},

		startGroup : function( title )
		{
			this._.list.startGroup( title );
		},

		commit : function()
		{
			if ( !this._.committed )
			{
				this._.list.commit();
				this._.committed = 1;
				CKeDITOR.ui.fire( 'ready', this );
			}
			this._.committed = 1;
		},

		setState : function( state )
		{
			if ( this._.state == state )
				return;

			this.document.getById( 'cKe_' + this.id ).setState( state );

			this._.state = state;
		}
	}
});

CKeDITOR.ui.prototype.addRichCombo = function( name, definition )
{
	this.add( name, CKeDITOR.UI_RICHCOMBO, definition );
};
