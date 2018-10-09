/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview The "elementspath" plugin. It shows all elements in the DOM
 *		parent tree relative to the current selection in the editing area.
 */

(function()
{
	var commands =
	{
		toolbarFocus :
		{
			editorFocus : false,
			readOnly : 1,
			exec : function( editor )
			{
				var idBase = editor._.elementsPath.idBase;
				var element = CKeDITOR.document.getById( idBase + '0' );

				// MaKe the first button focus accessible for IE. (#3417)
				// Adobe AIR instead need while of delay.
				element && element.focus( CKeDITOR.env.ie || CKeDITOR.env.air );
			}
		}
	};

	var emptyHtml = '<span class="cKe_empty">&nbsp;</span>';

	CKeDITOR.plugins.add( 'elementspath',
	{
		requires : [ 'selection' ],

		init : function( editor )
		{
			var spaceId = 'cKe_path_' + editor.name;
			var spaceElement;
			var getSpaceElement = function()
			{
				if ( !spaceElement )
					spaceElement = CKeDITOR.document.getById( spaceId );
				return spaceElement;
			};

			var idBase = 'cKe_elementspath_' + CKeDITOR.tools.getNextNumber() + '_';

			editor._.elementsPath = { idBase : idBase, filters : [] };

			editor.on( 'themeSpace', function( event )
				{
					if ( event.data.space == 'bottom' )
					{
						event.data.html +=
							'<span id="' + spaceId + '_label" class="cKe_voice_label">' + editor.lang.elementsPath.eleLabel + '</span>' +
							'<div id="' + spaceId + '" class="cKe_path" role="group" aria-labelledby="' + spaceId + '_label">' + emptyHtml + '</div>';
					}
				});

			function onClick( elementIndex )
			{
				editor.focus();
				var element = editor._.elementsPath.list[ elementIndex ];
				if ( element.is( 'body' ) )
				{
					var range = new CKeDITOR.dom.range( editor.document );
					range.selectNodeContents( element );
					range.select();
				}
				else
					editor.getSelection().selectElement( element );
			}

			var onClickHanlder = CKeDITOR.tools.addFunction( onClick );

			var onKeyDownHandler = CKeDITOR.tools.addFunction( function( elementIndex, ev )
				{
					var idBase = editor._.elementsPath.idBase,
						element;

					ev = new CKeDITOR.dom.event( ev );

					var rtl = editor.lang.dir == 'rtl';
					switch ( ev.getKeystroKe() )
					{
						case rtl ? 39 : 37 :		// LEFT-ARROW
						case 9 :					// TAB
							element = CKeDITOR.document.getById( idBase + ( elementIndex + 1 ) );
							if ( !element )
								element = CKeDITOR.document.getById( idBase + '0' );
							element.focus();
							return false;

						case rtl ? 37 : 39 :		// RIGHT-ARROW
						case CKeDITOR.SHIFT + 9 :	// SHIFT + TAB
							element = CKeDITOR.document.getById( idBase + ( elementIndex - 1 ) );
							if ( !element )
								element = CKeDITOR.document.getById( idBase + ( editor._.elementsPath.list.length - 1 ) );
							element.focus();
							return false;

						case 27 :					// ESC
							editor.focus();
							return false;

						case 13 :					// ENTER	// Opera
						case 32 :					// SPACE
							onClick( elementIndex );
							return false;
					}
					return true;
				});

			editor.on( 'selectionChange', function( ev )
				{
					var env = CKeDITOR.env,
						selection = ev.data.selection,
						element = selection.getStartElement(),
						html = [],
						editor = ev.editor,
						elementsList = editor._.elementsPath.list = [],
						filters = editor._.elementsPath.filters;

					while ( element )
					{
						var ignore = 0,
							name;

						if ( element.data( 'cKe-display-name' ) )
							name = element.data( 'cKe-display-name' );
						else if ( element.data( 'cKe-real-element-type' ) )
							name = element.data( 'cKe-real-element-type' );
						else
							name = element.getName();

						for ( var i = 0; i < filters.length; i++ )
						{
							var ret = filters[ i ]( element, name );
							if ( ret === false )
							{
								ignore = 1;
								break;
							}
							name = ret || name;
						}

						if ( !ignore )
						{
							var index = elementsList.push( element ) - 1;

							// Use this variable to add conditional stuff to the
							// HTML (because we are doing it in reverse order... unshift).
							var extra = '';

							// Some browsers don't cancel Key events in the Keydown but in the
							// Keypress.
							// TODO: Check if really needed for Gecko+Mac.
							if ( env.opera || ( env.gecko && env.mac ) )
								extra += ' onKeypress="return false;"';

							// With Firefox, we need to force the button to redraw, otherwise it
							// will remain in the focus state.
							if ( env.gecko )
								extra += ' onblur="this.style.cssText = this.style.cssText;"';

							var label = editor.lang.elementsPath.eleTitle.replace( /%1/, name );
							html.unshift(
								'<a' +
									' id="', idBase, index, '"' +
									' href="javascript:void(\'', name, '\')"' +
									' tabindex="-1"' +
									' title="', label, '"' +
									( ( CKeDITOR.env.gecko && CKeDITOR.env.version < 10900 ) ?
									' onfocus="event.preventBubble();"' : '' ) +
									' hidefocus="true" ' +
									' onKeydown="return CKeDITOR.tools.callFunction(', onKeyDownHandler, ',', index, ', event );"' +
									extra ,
									' onclick="CKeDITOR.tools.callFunction('+ onClickHanlder, ',', index, '); return false;"',
									' role="button" aria-labelledby="' + idBase + index + '_label">',
										name,
										'<span id="', idBase, index, '_label" class="cKe_label">' + label + '</span>',
								'</a>' );

						}

						if ( name == 'body' )
							break;

						element = element.getParent();
					}

					var space = getSpaceElement();
					space.setHtml( html.join('') + emptyHtml );
					editor.fire( 'elementsPathUpdate', { space : space } );
				});

			function empty()
			{
				spaceElement && spaceElement.setHtml( emptyHtml );
				delete editor._.elementsPath.list;
			}

			editor.on( 'readOnly', empty );
			editor.on( 'contentDomUnload', empty );

			editor.addCommand( 'elementsPathFocus', commands.toolbarFocus );
		}
	});
})();

/**
 * Fired when the contents of the elementsPath are changed
 * @name CKeDITOR.editor#elementsPathUpdate
 * @event
 * @param {Object} eventData.space The elementsPath container
 */
