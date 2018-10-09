/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'about',
{
	requires : [ 'dialog' ],
	init : function( editor )
	{
		var command = editor.addCommand( 'about', new CKeDITOR.dialogCommand( 'about' ) );
		command.modes = { wysiwyg:1, source:1 };
		command.canUndo = false;
		command.readOnly = 1;

		editor.ui.addButton( 'About',
			{
				label : editor.lang.about.title,
				command : 'about'
			});

		CKeDITOR.dialog.add( 'about', this.path + 'dialogs/about.js' );
	}
});
