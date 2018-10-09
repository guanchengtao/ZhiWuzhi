/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'panel',
{
	beforeInit : function( editor )
	{
		editor.ui.addHandler( CKeDITOR.UI_PANEL, CKeDITOR.ui.panel.handler );
	}
});

/**
 * Panel UI element.
 * @constant
 * @example
 */
CKeDITOR.UI_PANEL = 'panel';

CKeDITOR.ui.panel = function( document, definition )
{
	// Copy all definition properties to this object.
	if ( definition )
		CKeDITOR.tools.extend( this, definition );

	// Set defaults.
	CKeDITOR.tools.extend( this,
		{
			className : '',
			css : []
		});

	this.id = CKeDITOR.tools.getNextId();
	this.document = document;

	this._ =
	{
		blocks : {}
	};
};

/**
 * Transforms a rich combo definition in a {@link CKeDITOR.ui.richCombo}
 * instance.
 * @type Object
 * @example
 */
CKeDITOR.ui.panel.handler =
{
	create : function( definition )
	{
		return new CKeDITOR.ui.panel( definition );
	}
};

CKeDITOR.ui.panel.prototype =
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
		var id = this.id;

		output.push(
			'<div class="', editor.skinClass ,'"' +
				' lang="', editor.langCode, '"' +
				' role="presentation"' +
				// iframe loading need sometime, Keep the panel hidden(#4186).
				' style="display:none;z-index:' + ( editor.config.baseFloatZIndex + 1 ) + '">' +
				'<div' +
					' id=', id,
					' dir=', editor.lang.dir,
					' role="presentation"' +
					' class="cKe_panel cKe_', editor.lang.dir );

		if ( this.className )
			output.push( ' ', this.className );

		output.push(
				'">' );

		if ( this.forceIFrame || this.css.length )
		{
			output.push(
						'<iframe id="', id, '_frame"' +
							' frameborder="0"' +
							' role="application" src="javascript:void(' );

			output.push(
							// Support for custom document.domain in IE.
							CKeDITOR.env.isCustomDomain() ?
								'(function(){' +
									'document.open();' +
									'document.domain=\'' + document.domain + '\';' +
									'document.close();' +
								'})()'
							:
								'0' );

			output.push(
						')"></iframe>' );
		}

		output.push(
				'</div>' +
			'</div>' );

		return id;
	},

	getHolderElement : function()
	{
		var holder = this._.holder;

		if ( !holder )
		{
			if ( this.forceIFrame || this.css.length )
			{
				var iframe = this.document.getById( this.id + '_frame' ),
					parentDiv = iframe.getParent(),
					dir = parentDiv.getAttribute( 'dir' ),
					className = parentDiv.getParent().getAttribute( 'class' ),
					langCode = parentDiv.getParent().getAttribute( 'lang' ),
					doc = iframe.getFrameDocument();

				var onLoad = CKeDITOR.tools.addFunction( CKeDITOR.tools.bind( function( ev )
					{
						this.isLoaded = true;
						if ( this.onLoad )
							this.onLoad();
					}, this ) );

				var data =
					'<!DOCTYPE html>' +
					'<html dir="' + dir + '" class="' + className + '_container" lang="' + langCode + '">' +
						'<head>' +
							'<style>.' + className + '_container{visibility:hidden}</style>' +
						'</head>' +
						'<body class="cKe_' + dir + ' cKe_panel_frame ' + CKeDITOR.env.cssClass + '" style="margin:0;padding:0"' +
						' onload="( window.CKeDITOR || window.parent.CKeDITOR ).tools.callFunction(' + onLoad + ');"></body>' +
						// It looks strange, but for FF2, the styles must go
						// after <body>, so it (body) becames immediatelly
						// available. (#3031)
						CKeDITOR.tools.buildStyleHtml( this.css ) +
					'<\/html>';

				doc.write( data );

				var win = doc.getWindow();

				// Register the CKeDITOR global.
				win.$.CKeDITOR = CKeDITOR;

				// Arrow Keys for scrolling is only preventable with 'Keypress' event in Opera (#4534).
				doc.on( 'Key' + ( CKeDITOR.env.opera? 'press':'down' ), function( evt )
					{
						var KeystroKe = evt.data.getKeystroKe(),
							dir = this.document.getById( this.id ).getAttribute( 'dir' );

						// Delegate Key processing to block.
						if ( this._.onKeyDown && this._.onKeyDown( KeystroKe ) === false )
						{
							evt.data.preventDefault();
							return;
						}

						// ESC/ARROW-LEFT(ltr) OR ARROW-RIGHT(rtl)
						if ( KeystroKe == 27 || KeystroKe == ( dir == 'rtl' ? 39 : 37 ) )
						{
							if ( this.onEscape && this.onEscape( KeystroKe ) === false )
								evt.data.preventDefault();
						}
					},
					this );

				holder = doc.getBody();
				holder.unselectable();
				CKeDITOR.env.air && CKeDITOR.tools.callFunction( onLoad );
			}
			else
				holder = this.document.getById( this.id );

			this._.holder = holder;
		}

		return holder;
	},

	addBlock : function( name, block )
	{
		block = this._.blocks[ name ] = block instanceof CKeDITOR.ui.panel.block ?  block
				: new CKeDITOR.ui.panel.block( this.getHolderElement(), block );

		if ( !this._.currentBlock )
			this.showBlock( name );

		return block;
	},

	getBlock : function( name )
	{
		return this._.blocks[ name ];
	},

	showBlock : function( name )
	{
		var blocks = this._.blocks,
			block = blocks[ name ],
			current = this._.currentBlock,
			holder = this.forceIFrame ?
				this.document.getById( this.id + '_frame' )
				: this._.holder;

		// Disable context menu for block panel.
		holder.getParent().getParent().disableContextMenu();

		if ( current )
		{
			// Clean up the current block's effects on holder.
			holder.removeAttributes( current.attributes );
			current.hide();
		}

		this._.currentBlock = block;

		holder.setAttributes( block.attributes );
		CKeDITOR.fire( 'ariaWidget', holder );

		// Reset the focus index, so it will always go into the first one.
		block._.focusIndex = -1;

		this._.onKeyDown = block.onKeyDown && CKeDITOR.tools.bind( block.onKeyDown, block );

		block.onMark = function( item )
		{
			holder.setAttribute( 'aria-activedescendant', item.getId() + '_option' );
		};

		block.onUnmark = function()
		{
			holder.removeAttribute( 'aria-activedescendant' );
		};

		block.show();

		return block;
	},

	destroy : function()
	{
		this.element && this.element.remove();
	}
};

CKeDITOR.ui.panel.block = CKeDITOR.tools.createClass(
{
	$ : function( blockHolder, blockDefinition )
	{
		this.element = blockHolder.append(
			blockHolder.getDocument().createElement( 'div',
				{
					attributes :
					{
						'tabIndex' : -1,
						'class' : 'cKe_panel_block',
						'role' : 'presentation'
					},
					styles :
					{
						display : 'none'
					}
				}) );

		// Copy all definition properties to this object.
		if ( blockDefinition )
			CKeDITOR.tools.extend( this, blockDefinition );

		if ( !this.attributes.title )
			this.attributes.title = this.attributes[ 'aria-label' ];

		this.Keys = {};

		this._.focusIndex = -1;

		// Disable context menu for panels.
		this.element.disableContextMenu();
	},

	_ : {

		/**
		 * Mark the item specified by the index as current activated.
		 */
		markItem: function( index )
		{
			if ( index == -1 )
				return;
			var links = this.element.getElementsByTag( 'a' );
			var item = links.getItem( this._.focusIndex = index );

			// Safari need focus on the iframe window first(#3389), but we need
			// lock the blur to avoid hiding the panel.
			if ( CKeDITOR.env.webkit || CKeDITOR.env.opera )
				item.getDocument().getWindow().focus();
			item.focus();

			this.onMark && this.onMark( item );
		}
	},

	proto :
	{
		show : function()
		{
			this.element.setStyle( 'display', '' );
		},

		hide : function()
		{
			if ( !this.onHide || this.onHide.call( this )  !== true )
				this.element.setStyle( 'display', 'none' );
		},

		onKeyDown : function( KeystroKe )
		{
			var KeyAction = this.Keys[ KeystroKe ];
			switch ( KeyAction )
			{
				// Move forward.
				case 'next' :
					var index = this._.focusIndex,
						links = this.element.getElementsByTag( 'a' ),
						link;

					while ( ( link = links.getItem( ++index ) ) )
					{
						// Move the focus only if the element is marKed with
						// the _cKe_focus and it it's visible (check if it has
						// width).
						if ( link.getAttribute( '_cKe_focus' ) && link.$.offsetWidth )
						{
							this._.focusIndex = index;
							link.focus();
							break;
						}
					}
					return false;

				// Move backward.
				case 'prev' :
					index = this._.focusIndex;
					links = this.element.getElementsByTag( 'a' );

					while ( index > 0 && ( link = links.getItem( --index ) ) )
					{
						// Move the focus only if the element is marKed with
						// the _cKe_focus and it it's visible (check if it has
						// width).
						if ( link.getAttribute( '_cKe_focus' ) && link.$.offsetWidth )
						{
							this._.focusIndex = index;
							link.focus();
							break;
						}
					}
					return false;

				case 'click' :
					index = this._.focusIndex;
					link = index >= 0 && this.element.getElementsByTag( 'a' ).getItem( index );

					if ( link )
						link.$.click ? link.$.click() : link.$.onclick();

					return false;
			}

			return true;
		}
	}
});

/**
 * Fired when a panel is added to the document
 * @name CKeDITOR#ariaWidget
 * @event
 * @param {Object} holder The element wrapping the panel
 */
