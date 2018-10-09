/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'table',
{
	init : function( editor )
	{
		var table = CKeDITOR.plugins.table,
			lang = editor.lang.table;

		editor.addCommand( 'table', new CKeDITOR.dialogCommand( 'table' ) );
		editor.addCommand( 'tableProperties', new CKeDITOR.dialogCommand( 'tableProperties' ) );

		editor.ui.addButton( 'Table',
			{
				label : lang.toolbar,
				command : 'table'
			});

		CKeDITOR.dialog.add( 'table', this.path + 'dialogs/table.js' );
		CKeDITOR.dialog.add( 'tableProperties', this.path + 'dialogs/table.js' );

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems )
		{
			editor.addMenuItems(
				{
					table :
					{
						label : lang.menu,
						command : 'tableProperties',
						group : 'table',
						order : 5
					},

					tabledelete :
					{
						label : lang.deleteTable,
						command : 'tableDelete',
						group : 'table',
						order : 1
					}
				} );
		}

		editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'table' ) )
					evt.data.dialog = 'tableProperties';
			});

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu )
		{
			editor.contextMenu.addListener( function( element, selection )
				{
					if ( !element || element.isReadOnly() )
						return null;

					var isTable = element.hasAscendant( 'table', 1 );

					if ( isTable )
					{
						return {
							tabledelete : CKeDITOR.TRISTATE_OFF,
							table : CKeDITOR.TRISTATE_OFF
						};
					}

					return null;
				} );
		}
	}
} );
