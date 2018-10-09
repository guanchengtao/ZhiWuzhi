/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'button',
{
	beforeInit : function( editor )
	{
		editor.ui.addHandler( CKeDITOR.UI_BUTTON, CKeDITOR.ui.button.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
CKeDITOR.UI_BUTTON = 'button';

/**
 * Represents a button UI element. This class should not be called directly. To
 * create new buttons use {@link CKeDITOR.ui.prototype.addButton} instead.
 * @constructor
 * @param {Object} definition The button definition.
 * @example
 */
CKeDITOR.ui.button = function( definition )
{
	// Copy all definition properties to this object.
	CKeDITOR.tools.extend( this, definition,
		// Set defaults.
		{
			title		: definition.label,
			className	: definition.className || ( definition.command && 'cKe_button_' + definition.command ) || '',
			click		: definition.click || function( editor )
				{
					editor.execCommand( definition.command );
				}
		});

	this._ = {};
};

/**
 * Transforms a button definition in a {@link CKeDITOR.ui.button} instance.
 * @type Object
 * @example
 */
CKeDITOR.ui.button.handler =
{
	create : function( definition )
	{
		return new CKeDITOR.ui.button( definition );
	}
};

( function()
{
CKeDITOR.ui.button.prototype =
{
	/**
	 * Renders the button.
	 * @param {CKeDITOR.editor} editor The editor instance which this button is
	 *		to be used by.
	 * @param {Array} output The output array to which append the HTML relative
	 *		to this button.
	 * @example
	 */
	render : function( editor, output )
	{
		var env = CKeDITOR.env,
			id = this._.id = CKeDITOR.tools.getNextId(),
			classes = '',
			command = this.command, // Get the command name.
			clickFn;

		this._.editor = editor;

		var instance =
		{
			id : id,
			button : this,
			editor : editor,
			focus : function()
			{
				var element = CKeDITOR.document.getById( id );
				element.focus();
			},
			execute : function()
			{
				this.button.click( editor );
			}
		};

		var KeydownFn = CKeDITOR.tools.addFunction( function( ev )
			{
				if ( instance.onKey )
				{
					ev = new CKeDITOR.dom.event( ev );
					return ( instance.onKey( instance, ev.getKeystroKe() ) !== false );
				}
			});

		var focusFn = CKeDITOR.tools.addFunction( function( ev )
			{
				var retVal;

				if ( instance.onfocus )
					  retVal = ( instance.onfocus( instance, new CKeDITOR.dom.event( ev ) ) !== false );

				// FF2: prevent focus event been bubbled up to editor container, which caused unexpected editor focus.
				if ( CKeDITOR.env.gecko && CKeDITOR.env.version < 10900 )
					  ev.preventBubble();
				return retVal;
			});

		instance.clickFn = clickFn = CKeDITOR.tools.addFunction( instance.execute, instance );


		// Indicate a mode sensitive button.
		if ( this.modes )
		{
			var modeStates = {};

			function updateState()
			{
				// "this" is a CKeDITOR.ui.button instance.

				var mode = editor.mode;

				if ( mode )
				{
					// Restore saved button state.
					var state = this.modes[ mode ] ? modeStates[ mode ] != undefined ? modeStates[ mode ] :
							CKeDITOR.TRISTATE_OFF : CKeDITOR.TRISTATE_DISABLED;

					this.setState( editor.readOnly && !this.readOnly ? CKeDITOR.TRISTATE_DISABLED : state );
				}
			}

			editor.on( 'beforeModeUnload', function()
				{
					if ( editor.mode && this._.state != CKeDITOR.TRISTATE_DISABLED )
						modeStates[ editor.mode ] = this._.state;
				}, this );

			editor.on( 'mode', updateState, this);

			// If this button is sensitive to readOnly state, update it accordingly.
			!this.readOnly && editor.on( 'readOnly', updateState, this);
		}
		else if ( command )
		{
			// Get the command instance.
			command = editor.getCommand( command );

			if ( command )
			{
				command.on( 'state', function()
					{
						this.setState( command.state );
					}, this);

				classes += 'cKe_' + (
					command.state == CKeDITOR.TRISTATE_ON ? 'on' :
					command.state == CKeDITOR.TRISTATE_DISABLED ? 'disabled' :
					'off' );
			}
		}

		if ( !command )
			classes	+= 'cKe_off';

		if ( this.className )
			classes += ' ' + this.className;

		output.push(
			'<span class="cKe_button' + ( this.icon && this.icon.indexOf( '.png' ) == -1 ? ' cKe_noalphafix' : '' ) + '">',
			'<a id="', id, '"' +
				' class="', classes, '"',
				env.gecko && env.version >= 10900 && !env.hc  ? '' : '" href="javascript:void(\''+ ( this.title || '' ).replace( "'", '' )+ '\')"',
				' title="', this.title, '"' +
				' tabindex="-1"' +
				' hidefocus="true"' +
			    ' role="button"' +
				' aria-labelledby="' + id + '_label"' +
				( this.hasArrow ?  ' aria-haspopup="true"' : '' ) );

		// Some browsers don't cancel Key events in the Keydown but in the
		// Keypress.
		// TODO: Check if really needed for Gecko+Mac.
		if ( env.opera || ( env.gecko && env.mac ) )
		{
			output.push(
				' onKeypress="return false;"' );
		}

		// With Firefox, we need to force the button to redraw, otherwise it
		// will remain in the focus state.
		if ( env.gecko )
		{
			output.push(
				' onblur="this.style.cssText = this.style.cssText;"' );
		}

		output.push(
					' onKeydown="return CKeDITOR.tools.callFunction(', KeydownFn, ', event);"' +
					' onfocus="return CKeDITOR.tools.callFunction(', focusFn,', event);"' +
				' onclick="CKeDITOR.tools.callFunction(', clickFn, ', this); return false;">' +
					'<span class="cKe_icon"' );

		if ( this.icon )
		{
			var offset = ( this.iconOffset || 0 ) * -16;
			output.push( ' style="background-image:url(', CKeDITOR.getUrl( this.icon ), ');background-position:0 ' + offset + 'px;"' );
		}

		output.push(
					'>&nbsp;</span>' +
					'<span id="', id, '_label" class="cKe_label">', this.label, '</span>' );

		if ( this.hasArrow )
		{
			output.push(
					'<span class="cKe_buttonarrow">'
					// BLACK DOWN-POINTING TRIANGLE
					+ ( CKeDITOR.env.hc ? '&#9660;' : '&nbsp;' )
					+ '</span>' );
		}

		output.push(
			'</a>',
			'</span>' );

		if ( this.onRender )
			this.onRender();

		return instance;
	},

	setState : function( state )
	{
		if ( this._.state == state )
			return false;

		this._.state = state;

		var element = CKeDITOR.document.getById( this._.id );

		if ( element )
		{
			element.setState( state );
			state == CKeDITOR.TRISTATE_DISABLED ?
				element.setAttribute( 'aria-disabled', true ) :
				element.removeAttribute( 'aria-disabled' );

			state == CKeDITOR.TRISTATE_ON ?
				element.setAttribute( 'aria-pressed', true ) :
				element.removeAttribute( 'aria-pressed' );

			return true;
		}
		else
			return false;
	}
};

})();

/**
 * Adds a button definition to the UI elements list.
 * @param {String} name The button name.
 * @param {Object} definition The button definition.
 * @example
 * editorInstance.ui.addButton( 'MyBold',
 *     {
 *         label : 'My Bold',
 *         command : 'bold'
 *     });
 */
CKeDITOR.ui.prototype.addButton = function( name, definition )
{
	this.add( name, CKeDITOR.UI_BUTTON, definition );
};
