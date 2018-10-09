/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	CKeDITOR.plugins.add( 'templates',
		{
			requires : [ 'dialog' ],

			init : function( editor )
			{
				CKeDITOR.dialog.add( 'templates', CKeDITOR.getUrl( this.path + 'dialogs/templates.js' ) );

				editor.addCommand( 'templates', new CKeDITOR.dialogCommand( 'templates' ) );

				editor.ui.addButton( 'Templates',
					{
						label : editor.lang.templates.button,
						command : 'templates'
					});
			}
		});

	var templates = {},
		loadedTemplatesFiles = {};

	CKeDITOR.addTemplates = function( name, definition )
	{
		templates[ name ] = definition;
	};

	CKeDITOR.getTemplates = function( name )
	{
		return templates[ name ];
	};

	CKeDITOR.loadTemplates = function( templateFiles, callback )
	{
		// Holds the templates files to be loaded.
		var toLoad = [];

		// Look for pending template files to get loaded.
		for ( var i = 0, count = templateFiles.length ; i < count ; i++ )
		{
			if ( !loadedTemplatesFiles[ templateFiles[ i ] ] )
			{
				toLoad.push( templateFiles[ i ] );
				loadedTemplatesFiles[ templateFiles[ i ] ] = 1;
			}
		}

		if ( toLoad.length )
			CKeDITOR.scriptLoader.load( toLoad, callback );
		else
			setTimeout( callback, 0 );
	};
})();



/**
 * The templates definition set to use. It accepts a list of names separated by
 * comma. It must match definitions loaded with the templates_files setting.
 * @type String
 * @default 'default'
 * @example
 * config.templates = 'my_templates';
 */

/**
 * The list of templates definition files to load.
 * @type (String) Array
 * @default [ 'plugins/templates/templates/default.js' ]
 * @example
 * config.templates_files =
 *     [
 *         '/editor_templates/site_default.js',
 *         'http://www.example.com/user_templates.js
 *     ];
 *
 */
CKeDITOR.config.templates_files =
	[
		CKeDITOR.getUrl(
			'_source/' + // @Packager.RemoveLine
			'plugins/templates/templates/default.js' )
	];

/**
 * Whether the "Replace actual contents" checkbox is checKed by default in the
 * Templates dialog.
 * @type Boolean
 * @default true
 * @example
 * config.templates_replaceContent = false;
 */
CKeDITOR.config.templates_replaceContent = true;
