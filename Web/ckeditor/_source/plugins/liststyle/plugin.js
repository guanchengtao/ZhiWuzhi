/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	CKeDITOR.plugins.liststyle =
	{
		requires : [ 'dialog' ],
		init : function( editor )
		{
			editor.addCommand( 'numberedListStyle', new CKeDITOR.dialogCommand( 'numberedListStyle' ) );
			CKeDITOR.dialog.add( 'numberedListStyle', this.path + 'dialogs/liststyle.js' );
			editor.addCommand( 'bulletedListStyle', new CKeDITOR.dialogCommand( 'bulletedListStyle' ) );
			CKeDITOR.dialog.add( 'bulletedListStyle', this.path + 'dialogs/liststyle.js' );

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				//Register map group;
				editor.addMenuGroup("list", 108);

				editor.addMenuItems(
					{
						numberedlist :
						{
							label : editor.lang.list.numberedTitle,
							group : 'list',
							command: 'numberedListStyle'
						},
						bulletedlist :
						{
							label : editor.lang.list.bulletedTitle,
							group : 'list',
							command: 'bulletedListStyle'
						}
					});
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						if ( !element || element.isReadOnly() )
							return null;

						while ( element )
						{
							var name = element.getName();
							if ( name == 'ol' )
								return { numberedlist: CKeDITOR.TRISTATE_OFF };
							else if ( name == 'ul' )
								return { bulletedlist: CKeDITOR.TRISTATE_OFF };

							element = element.getParent();
						}
						return null;
					});
			}
		}
	};

	CKeDITOR.plugins.add( 'liststyle', CKeDITOR.plugins.liststyle );
})();
