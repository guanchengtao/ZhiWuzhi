/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'find',
{
	init : function( editor )
	{
		var forms = CKeDITOR.plugins.find;
		editor.ui.addButton( 'Find',
			{
				label : editor.lang.findAndReplace.find,
				command : 'find'
			});
		var findCommand = editor.addCommand( 'find', new CKeDITOR.dialogCommand( 'find' ) );
		findCommand.canUndo = false;
		findCommand.readOnly = 1;

		editor.ui.addButton( 'Replace',
			{
				label : editor.lang.findAndReplace.replace,
				command : 'replace'
			});
		var replaceCommand = editor.addCommand( 'replace', new CKeDITOR.dialogCommand( 'replace' ) );
		replaceCommand.canUndo = false;

		CKeDITOR.dialog.add( 'find',	this.path + 'dialogs/find.js' );
		CKeDITOR.dialog.add( 'replace',	this.path + 'dialogs/find.js' );
	},

	requires : [ 'styles' ]
} );

/**
 * Defines the style to be used to highlight results with the find dialog.
 * @type Object
 * @default { element : 'span', styles : { 'background-color' : '#004', 'color' : '#fff' } }
 * @example
 * // Highlight search results with blue on yellow.
 * config.find_highlight =
 *     {
 *         element : 'span',
 *         styles : { 'background-color' : '#ff0', 'color' : '#00f' }
 *     };
 */
CKeDITOR.config.find_highlight = { element : 'span', styles : { 'background-color' : '#004', 'color' : '#fff' } };
