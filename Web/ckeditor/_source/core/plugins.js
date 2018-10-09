/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.plugins} object, which is used to
 *		manage plugins registration and loading.
 */

/**
 * Manages plugins registration and loading.
 * @namespace
 * @augments CKeDITOR.resourceManager
 * @example
 */
CKeDITOR.plugins = new CKeDITOR.resourceManager(
	'_source/' +	// @Packager.RemoveLine
	'plugins/', 'plugin' );

// PACKAGER_RENAME( CKeDITOR.plugins )

CKeDITOR.plugins.load = CKeDITOR.tools.override( CKeDITOR.plugins.load, function( originalLoad )
	{
		return function( name, callback, scope )
		{
			var allPlugins = {};

			var loadPlugins = function( names )
			{
				originalLoad.call( this, names, function( plugins )
					{
						CKeDITOR.tools.extend( allPlugins, plugins );

						var requiredPlugins = [];
						for ( var pluginName in plugins )
						{
							var plugin = plugins[ pluginName ],
								requires = plugin && plugin.requires;

							if ( requires )
							{
								for ( var i = 0 ; i < requires.length ; i++ )
								{
									if ( !allPlugins[ requires[ i ] ] )
										requiredPlugins.push( requires[ i ] );
								}
							}
						}

						if ( requiredPlugins.length )
							loadPlugins.call( this, requiredPlugins );
						else
						{
							// Call the "onLoad" function for all plugins.
							for ( pluginName in allPlugins )
							{
								plugin = allPlugins[ pluginName ];
								if ( plugin.onLoad && !plugin.onLoad._called )
								{
									plugin.onLoad();
									plugin.onLoad._called = 1;
								}
							}

							// Call the callback.
							if ( callback )
								callback.call( scope || window, allPlugins );
						}
					}
					, this);

			};

			loadPlugins.call( this, name );
		};
	});

/**
 * Loads a specific language file, or auto detect it. A callback is
 * then called when the file gets loaded.
 * @param {String} pluginName The name of the plugin to which the provided translation
 * 		should be attached.
 * @param {String} languageCode The code of the language translation provided.
 * @param {Object} languageEntries An object that contains pairs of label and
 *		the respective translation.
 * @example
 * CKeDITOR.plugins.setLang( 'myPlugin', 'en', {
 * 	title : 'My plugin',
 * 	selectOption : 'Please select an option'
 * } );
 */
CKeDITOR.plugins.setLang = function( pluginName, languageCode, languageEntries )
{
	var plugin = this.get( pluginName ),
		pluginLangEntries = plugin.langEntries || ( plugin.langEntries = {} ),
		pluginLang = plugin.lang || ( plugin.lang = [] );

	if ( CKeDITOR.tools.indexOf( pluginLang, languageCode ) == -1 )
		pluginLang.push( languageCode );

	pluginLangEntries[ languageCode ] = languageEntries;
};
