/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Plugin definition for the a11yhelp, which provides a dialog
 * with accessibility related help.
 */

(function()
{
	var pluginName = 'a11yhelp',
		commandName = 'a11yHelp';

	CKeDITOR.plugins.add( pluginName,
	{
		// List of available localizations.
		availableLangs : { en:1, he:1 },

		init : function( editor )
		{
			var plugin = this;
			editor.addCommand( commandName,
				{
					exec : function()
					{
						var langCode = editor.langCode;
						langCode = plugin.availableLangs[ langCode ] ? langCode : 'en';

						CKeDITOR.scriptLoader.load(
								CKeDITOR.getUrl( plugin.path + 'lang/' + langCode + '.js' ),
								function()
								{
									CKeDITOR.tools.extend( editor.lang, plugin.langEntries[ langCode ] );
									editor.openDialog( commandName );
								});
					},
					modes : { wysiwyg:1, source:1 },
					readOnly : 1,
					canUndo : false
				});

			CKeDITOR.dialog.add( commandName, this.path + 'dialogs/a11yhelp.js' );
		}
	});
})();
