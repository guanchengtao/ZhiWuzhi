/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @file Clipboard support
 */

(function()
{
	// Tries to execute any of the paste, cut or copy commands in IE. Returns a
	// boolean indicating that the operation succeeded.
	var execIECommand = function( editor, command )
	{
		var doc = editor.document,
			body = doc.getBody();

		var enabled = 0;
		var onExec = function()
		{
			enabled = 1;
		};

		// The following seems to be the only reliable way to detect that
		// clipboard commands are enabled in IE. It will fire the
		// onpaste/oncut/oncopy events only if the security settings allowed
		// the command to execute.
		body.on( command, onExec );

		// IE6/7: document.execCommand has problem to paste into positioned element.
		( CKeDITOR.env.version > 7 ? doc.$ : doc.$.selection.createRange() ) [ 'execCommand' ]( command );

		body.removeListener( command, onExec );

		return enabled;
	};

	// Attempts to execute the Cut and Copy operations.
	var tryToCutCopy =
		CKeDITOR.env.ie ?
			function( editor, type )
			{
				return execIECommand( editor, type );
			}
		:		// !IE.
			function( editor, type )
			{
				try
				{
					// Other browsers throw an error if the command is disabled.
					return editor.document.$.execCommand( type, false, null );
				}
				catch( e )
				{
					return false;
				}
			};

	// A class that represents one of the cut or copy commands.
	var cutCopyCmd = function( type )
	{
		this.type = type;
		this.canUndo = this.type == 'cut';		// We can't undo copy to clipboard.
		this.startDisabled = true;
	};

	cutCopyCmd.prototype =
	{
		exec : function( editor, data )
		{
			this.type == 'cut' && fixCut( editor );

			var success = tryToCutCopy( editor, this.type );

			if ( !success )
				alert( editor.lang.clipboard[ this.type + 'Error' ] );		// Show cutError or copyError.

			return success;
		}
	};

	// Paste command.
	var pasteCmd =
	{
		canUndo : false,

		exec :
			CKeDITOR.env.ie ?
				function( editor )
				{
					// Prevent IE from pasting at the begining of the document.
					editor.focus();

					if ( !editor.document.getBody().fire( 'beforepaste' )
						 && !execIECommand( editor, 'paste' ) )
					{
						editor.fire( 'pasteDialog' );
						return false;
					}
				}
			:
				function( editor )
				{
					try
					{
						if ( !editor.document.getBody().fire( 'beforepaste' )
							 && !editor.document.$.execCommand( 'Paste', false, null ) )
						{
							throw 0;
						}
					}
					catch ( e )
					{
						setTimeout( function()
							{
								editor.fire( 'pasteDialog' );
							}, 0 );
						return false;
					}
				}
	};

	// Listens for some clipboard related KeystroKes, so they get customized.
	var onKey = function( event )
	{
		if ( this.mode != 'wysiwyg' )
			return;

		switch ( event.data.KeyCode )
		{
			// Paste
			case CKeDITOR.CTRL + 86 :		// CTRL+V
			case CKeDITOR.SHIFT + 45 :		// SHIFT+INS

				var body = this.document.getBody();

				// Simulate 'beforepaste' event for all none-IEs.
				if ( !CKeDITOR.env.ie && body.fire( 'beforepaste' ) )
					event.cancel();
				// Simulate 'paste' event for Opera/Firefox2.
				else if ( CKeDITOR.env.opera
						 || CKeDITOR.env.gecko && CKeDITOR.env.version < 10900 )
					body.fire( 'paste' );
				return;

			// Cut
			case CKeDITOR.CTRL + 88 :		// CTRL+X
			case CKeDITOR.SHIFT + 46 :		// SHIFT+DEL

				// Save Undo snapshot.
				var editor = this;
				this.fire( 'saveSnapshot' );		// Save before paste
				setTimeout( function()
					{
						editor.fire( 'saveSnapshot' );		// Save after paste
					}, 0 );
		}
	};

	function cancel( evt ) { evt.cancel(); }

	// Allow to peek clipboard content by redirecting the
	// pasting content into a temporary bin and grab the content of it.
	function getClipboardData( evt, mode, callback )
	{
		var doc = this.document;

		// Avoid recursions on 'paste' event or consequent paste too fast. (#5730)
		if ( doc.getById( 'cKe_pastebin' ) )
			return;

		// If the browser supports it, get the data directly
		if ( mode == 'text' && evt.data && evt.data.$.clipboardData )
		{
			// evt.data.$.clipboardData.types contains all the flavours in Mac's Safari, but not on windows.
			var plain = evt.data.$.clipboardData.getData( 'text/plain' );
			if ( plain )
			{
				evt.data.preventDefault();
				callback( plain );
				return;
			}
		}

		var sel = this.getSelection(),
			range = new CKeDITOR.dom.range( doc );

		// Create container to paste into
		var pastebin = new CKeDITOR.dom.element( mode == 'text' ? 'textarea' : CKeDITOR.env.webkit ? 'body' : 'div', doc );
		pastebin.setAttribute( 'id', 'cKe_pastebin' );
		// Safari requires a filler node inside the div to have the content pasted into it. (#4882)
		CKeDITOR.env.webkit && pastebin.append( doc.createText( '\xa0' ) );
		doc.getBody().append( pastebin );

		pastebin.setStyles(
			{
				position : 'absolute',
				// Position the bin exactly at the position of the selected element
				// to avoid any subsequent document scroll.
				top : sel.getStartElement().getDocumentPosition().y + 'px',
				width : '1px',
				height : '1px',
				overflow : 'hidden'
			});

		// It's definitely a better user experience if we maKe the paste-bin pretty unnoticed
		// by pulling it off the screen.
		pastebin.setStyle( this.config.contentsLangDirection == 'ltr' ? 'left' : 'right', '-1000px' );

		var bms = sel.createBookmarks();

		this.on( 'selectionChange', cancel, null, null, 0 );

		// Turn off design mode temporarily before give focus to the paste bin.
		if ( mode == 'text' )
			pastebin.$.focus();
		else
		{
			range.setStartAt( pastebin, CKeDITOR.POSITION_AFTER_START );
			range.setEndAt( pastebin, CKeDITOR.POSITION_BEFORE_END );
			range.select( true );
		}

		var editor  = this;
		// Wait a while and grab the pasted contents
		window.setTimeout( function()
		{
			mode == 'text' && CKeDITOR.env.gecko && editor.focusGrabber.focus();
			pastebin.remove();
			editor.removeListener( 'selectionChange', cancel );

			// Grab the HTML contents.
			// We need to look for a apple style wrapper on webkit it also adds
			// a div wrapper if you copy/paste the body of the editor.
			// Remove hidden div and restore selection.
			var bogusSpan;
			pastebin = ( CKeDITOR.env.webkit
						 && ( bogusSpan = pastebin.getFirst() )
						 && ( bogusSpan.is && bogusSpan.hasClass( 'Apple-style-span' ) ) ?
							bogusSpan : pastebin );

			sel.selectBookmarks( bms );
			callback( pastebin[ 'get' + ( mode == 'text' ? 'Value' : 'Html' ) ]() );
		}, 0 );
	}

	// Cutting off control type element in IE standards breaks the selection entirely. (#4881)
	function fixCut( editor )
	{
		if ( !CKeDITOR.env.ie || CKeDITOR.env.quirks )
			return;

		var sel = editor.getSelection();
		var control;
		if( ( sel.getType() == CKeDITOR.SELECTION_ELEMENT ) && ( control = sel.getSelectedElement() ) )
		{
			var range = sel.getRanges()[ 0 ];
			var dummy = editor.document.createText( '' );
			dummy.insertBefore( control );
			range.setStartBefore( dummy );
			range.setEndAfter( control );
			sel.selectRanges( [ range ] );

			// Clear up the fix if the paste wasn't succeeded.
			setTimeout( function()
			{
				// Element still online?
				if ( control.getParent() )
				{
					dummy.remove();
					sel.selectElement( control );
				}
			}, 0 );
		}
	}

	var depressBeforeEvent;
	function stateFromNamedCommand( command, editor )
	{
		// IE Bug: queryCommandEnabled('paste') fires also 'beforepaste(copy/cut)',
		// guard to distinguish from the ordinary sources( either
		// Keyboard paste or execCommand ) (#4874).
		CKeDITOR.env.ie && ( depressBeforeEvent = 1 );

		var retval = CKeDITOR.TRISTATE_OFF;
		try { retval = editor.document.$.queryCommandEnabled( command ) ? CKeDITOR.TRISTATE_OFF : CKeDITOR.TRISTATE_DISABLED; }catch( er ){}

		depressBeforeEvent = 0;
		return retval;
	}

	var inReadOnly;
	function setToolbarStates()
	{
		if ( this.mode != 'wysiwyg' )
			return;

		this.getCommand( 'cut' ).setState( inReadOnly ? CKeDITOR.TRISTATE_DISABLED : stateFromNamedCommand( 'Cut', this ) );
		this.getCommand( 'copy' ).setState( stateFromNamedCommand( 'Copy', this ) );
		var pasteState = inReadOnly ? CKeDITOR.TRISTATE_DISABLED :
						CKeDITOR.env.webkit ? CKeDITOR.TRISTATE_OFF : stateFromNamedCommand( 'Paste', this );
		this.fire( 'pasteState', pasteState );
	}

	// Register the plugin.
	CKeDITOR.plugins.add( 'clipboard',
		{
			requires : [ 'dialog', 'htmldataprocessor' ],
			init : function( editor )
			{
				// Inserts processed data into the editor at the end of the
				// events chain.
				editor.on( 'paste', function( evt )
					{
						var data = evt.data;
						if ( data[ 'html' ] )
							editor.insertHtml( data[ 'html' ] );
						else if ( data[ 'text' ] )
							editor.insertText( data[ 'text' ] );

						setTimeout( function () { editor.fire( 'afterPaste' ); }, 0 );

					}, null, null, 1000 );

				editor.on( 'pasteDialog', function( evt )
					{
						setTimeout( function()
						{
							// Open default paste dialog.
							editor.openDialog( 'paste' );
						}, 0 );
					});

				editor.on( 'pasteState', function( evt )
					{
						editor.getCommand( 'paste' ).setState( evt.data );
					});

				function addButtonCommand( buttonName, commandName, command, ctxMenuOrder )
				{
					var lang = editor.lang[ commandName ];

					editor.addCommand( commandName, command );
					editor.ui.addButton( buttonName,
						{
							label : lang,
							command : commandName
						});

					// If the "menu" plugin is loaded, register the menu item.
					if ( editor.addMenuItems )
					{
						editor.addMenuItem( commandName,
							{
								label : lang,
								command : commandName,
								group : 'clipboard',
								order : ctxMenuOrder
							});
					}
				}

				addButtonCommand( 'Cut', 'cut', new cutCopyCmd( 'cut' ), 1 );
				addButtonCommand( 'Copy', 'copy', new cutCopyCmd( 'copy' ), 4 );
				addButtonCommand( 'Paste', 'paste', pasteCmd, 8 );

				CKeDITOR.dialog.add( 'paste', CKeDITOR.getUrl( this.path + 'dialogs/paste.js' ) );

				editor.on( 'Key', onKey, editor );

				// We'll be catching all pasted content in one line, regardless of whether the
				// it's introduced by a document command execution (e.g. toolbar buttons) or
				// user paste behaviors. (e.g. Ctrl-V)
				editor.on( 'contentDom', function()
				{
					var body = editor.document.getBody();
					body.on( CKeDITOR.env.webkit ? 'paste' : 'beforepaste', function( evt )
						{
							if ( depressBeforeEvent )
								return;

							// Fire 'beforePaste' event so clipboard flavor get customized
							// by other plugins.
							var eventData =  { mode : 'html' };
							editor.fire( 'beforePaste', eventData );

							getClipboardData.call( editor, evt, eventData.mode, function ( data )
							{
								// The very last guard to maKe sure the
								// paste has successfully happened.
								if ( !( data = CKeDITOR.tools.trim( data.replace( /<span[^>]+data-cKe-bookmark[^<]*?<\/span>/ig,'' ) ) ) )
									return;

								var dataTransfer = {};
								dataTransfer[ eventData.mode ] = data;
								editor.fire( 'paste', dataTransfer );
							} );
						});

					body.on( 'beforecut', function() { !depressBeforeEvent && fixCut( editor ); } );

					body.on( 'mouseup', function(){ setTimeout( function(){ setToolbarStates.call( editor ); }, 0 ); }, editor );
					body.on( 'Keyup', setToolbarStates, editor );
				});

				// For improved performance, we're checking the readOnly state on selectionChange instead of hooking a Key event for that.
				editor.on( 'selectionChange', function( evt )
				{
					inReadOnly = evt.data.selection.getRanges()[ 0 ].checkReadOnly();
					setToolbarStates.call( editor );
				});

				// If the "contextmenu" plugin is loaded, register the listeners.
				if ( editor.contextMenu )
				{
					editor.contextMenu.addListener( function( element, selection )
						{
							var readOnly = selection.getRanges()[ 0 ].checkReadOnly();
							return {
								cut : !readOnly && stateFromNamedCommand( 'Cut', editor ),
								copy : stateFromNamedCommand( 'Copy', editor ),
								paste : !readOnly && ( CKeDITOR.env.webkit ? CKeDITOR.TRISTATE_OFF : stateFromNamedCommand( 'Paste', editor ) )
							};
						});
				}
			}
		});
})();

/**
 * Fired when a clipboard operation is about to be taKen into the editor.
 * Listeners can manipulate the data to be pasted before having it effectively
 * inserted into the document.
 * @name CKeDITOR.editor#paste
 * @since 3.1
 * @event
 * @param {String} [data.html] The HTML data to be pasted. If not available, e.data.text will be defined.
 * @param {String} [data.text] The plain text data to be pasted, available when plain text operations are to used. If not available, e.data.html will be defined.
 */

/**
 * Internal event to open the Paste dialog
 * @name CKeDITOR.editor#pasteDialog
 * @event
 */
