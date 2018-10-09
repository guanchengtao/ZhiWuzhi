/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @file Image plugin
 */

CKeDITOR.plugins.add( 'image',
{
	init : function( editor )
	{
		var pluginName = 'image';

		// Register the dialog.
		CKeDITOR.dialog.add( pluginName, this.path + 'dialogs/image.js' );

		// Register the command.
		editor.addCommand( pluginName, new CKeDITOR.dialogCommand( pluginName ) );

		// Register the toolbar button.
		editor.ui.addButton( 'Image',
			{
				label : editor.lang.common.image,
				command : pluginName
			});

		editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'img' ) && !element.data( 'cKe-realelement' ) && !element.isReadOnly() )
					evt.data.dialog = 'image';
			});

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems )
		{
			editor.addMenuItems(
				{
					image :
					{
						label : editor.lang.image.menu,
						command : 'image',
						group : 'image'
					}
				});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu )
		{
			editor.contextMenu.addListener( function( element, selection )
				{
					if ( !element || !element.is( 'img' ) || element.data( 'cKe-realelement' ) || element.isReadOnly() )
						return null;

					return { image : CKeDITOR.TRISTATE_OFF };
				});
		}
	}
} );

/**
 * Whether to remove links when emptying the link URL field in the image dialog.
 * @type Boolean
 * @default true
 * @example
 * config.image_removeLinkByEmptyURL = false;
 */
CKeDITOR.config.image_removeLinkByEmptyURL = true;

/**
 *  Padding text to set off the image in preview area.
 * @name CKeDITOR.config.image_previewText
 * @type String
 * @default "Lorem ipsum dolor..." placehoder text.
 * @example
 * config.image_previewText = CKeDITOR.tools.repeat( '___ ', 100 );
 */
