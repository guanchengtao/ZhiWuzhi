/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @file Print Plugin
 */

CKeDITOR.plugins.add( 'print',
{
	init : function( editor )
	{
		var pluginName = 'print';

		// Register the command.
		var command = editor.addCommand( pluginName, CKeDITOR.plugins.print );

		// Register the toolbar button.
		editor.ui.addButton( 'Print',
			{
				label : editor.lang.print,
				command : pluginName
			});
	}
} );

CKeDITOR.plugins.print =
{
	exec : function( editor )
	{
		if ( CKeDITOR.env.opera )
			return;
		else if ( CKeDITOR.env.gecko )
			editor.window.$.print();
		else
			editor.document.$.execCommand( "Print" );
	},
	canUndo : false,
	readOnly : 1,
	modes : { wysiwyg : !( CKeDITOR.env.opera ) }		// It is imposible to print the inner document in Opera.
};
