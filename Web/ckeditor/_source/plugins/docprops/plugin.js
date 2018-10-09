/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'docprops',
{
	init : function( editor )
	{
		var cmd = new CKeDITOR.dialogCommand( 'docProps' );
		// Only applicable on full page mode.
		cmd.modes = { wysiwyg : editor.config.fullPage };
		editor.addCommand( 'docProps', cmd );
		CKeDITOR.dialog.add( 'docProps', this.path + 'dialogs/docprops.js' );

		editor.ui.addButton( 'DocProps',
		{
			label : editor.lang.docprops.label,
			command : 'docProps'
		});
	}
});
