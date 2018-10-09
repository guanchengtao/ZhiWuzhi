/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.colordialog =
{
	init : function( editor )
	{
		editor.addCommand( 'colordialog', new CKeDITOR.dialogCommand( 'colordialog' ) );
		CKeDITOR.dialog.add( 'colordialog', this.path + 'dialogs/colordialog.js' );
	}
};

CKeDITOR.plugins.add( 'colordialog', CKeDITOR.plugins.colordialog );
