/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview The "div" plugin. It wraps the selected block level elements with a 'div' element with specified styles and attributes.
 *
 */

(function()
{
	CKeDITOR.plugins.add( 'div',
	{
		requires : [ 'editingblock', 'domiterator', 'styles' ],

		init : function( editor )
		{
			var lang = editor.lang.div;

			editor.addCommand( 'creatediv', new CKeDITOR.dialogCommand( 'creatediv' ) );
			editor.addCommand( 'editdiv', new CKeDITOR.dialogCommand( 'editdiv' ) );
			editor.addCommand( 'removediv',
				{
					exec : function( editor )
					{
						var selection = editor.getSelection(),
							ranges = selection && selection.getRanges(),
							range,
							bookmarks = selection.createBookmarks(),
							walKer,
							toRemove = [];

						function findDiv( node )
						{
							var path = new CKeDITOR.dom.elementPath( node ),
								blockLimit = path.blockLimit,
								div = blockLimit.is( 'div' ) && blockLimit;

							if ( div && !div.data( 'cKe-div-added' ) )
							{
								toRemove.push( div );
								div.data( 'cKe-div-added' );
							}
						}

						for ( var i = 0 ; i < ranges.length ; i++ )
						{
							range = ranges[ i ];
							if ( range.collapsed )
								findDiv( selection.getStartElement() );
							else
							{
								walKer = new CKeDITOR.dom.walKer( range );
								walKer.evaluator = findDiv;
								walKer.lastForward();
							}
						}

						for ( i = 0 ; i < toRemove.length ; i++ )
							toRemove[ i ].remove( true );

						selection.selectBookmarks( bookmarks );
					}
				} );

			editor.ui.addButton( 'CreateDiv',
			{
				label : lang.toolbar,
				command :'creatediv'
			} );

			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
					{
						editdiv :
						{
							label : lang.edit,
							command : 'editdiv',
							group : 'div',
							order : 1
						},

						removediv:
						{
							label : lang.remove,
							command : 'removediv',
							group : 'div',
							order : 5
						}
					} );

				if ( editor.contextMenu )
				{
					editor.contextMenu.addListener( function( element, selection )
						{
							if ( !element || element.isReadOnly() )
								return null;

							var elementPath = new CKeDITOR.dom.elementPath( element ),
								blockLimit = elementPath.blockLimit;

							if ( blockLimit && blockLimit.getAscendant( 'div', true ) )
							{
								return {
									editdiv : CKeDITOR.TRISTATE_OFF,
									removediv : CKeDITOR.TRISTATE_OFF
								};
							}

							return null;
						} );
				}
			}

			CKeDITOR.dialog.add( 'creatediv', this.path + 'dialogs/div.js' );
			CKeDITOR.dialog.add( 'editdiv', this.path + 'dialogs/div.js' );
		}
	} );
})();
