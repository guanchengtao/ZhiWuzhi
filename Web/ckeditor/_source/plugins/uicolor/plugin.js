/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'uicolor',
{
	requires : [ 'dialog' ],
	lang : [ 'en', 'he' ],

	init : function( editor )
	{
		if ( CKeDITOR.env.ie6Compat )
			return;

		editor.addCommand( 'uicolor', new CKeDITOR.dialogCommand( 'uicolor' ) );
		editor.ui.addButton( 'UIColor',
			{
				label : editor.lang.uicolor.title,
				command : 'uicolor',
				icon : this.path + 'uicolor.gif'
			});
		CKeDITOR.dialog.add( 'uicolor', this.path + 'dialogs/uicolor.js' );

		// Load YUI js files.
		CKeDITOR.scriptLoader.load( CKeDITOR.getUrl(
			'_source/' + // @Packager.RemoveLine
			'plugins/uicolor/yui/yui.js'
		));

		// Load YUI css files.
		editor.element.getDocument().appendStyleSheet( CKeDITOR.getUrl(
				'_source/' + // @Packager.RemoveLine
				'plugins/uicolor/yui/assets/yui.css'
		));
	}
} );
