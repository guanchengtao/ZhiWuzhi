/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add( 'basicstyles',
{
	requires : [ 'styles', 'button' ],

	init : function( editor )
	{
		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, buttonLabel, commandName, styleDefiniton )
		{
			var style = new CKeDITOR.style( styleDefiniton );

			editor.attachStyleStateChange( style, function( state )
				{
					!editor.readOnly && editor.getCommand( commandName ).setState( state );
				});

			editor.addCommand( commandName, new CKeDITOR.styleCommand( style ) );

			editor.ui.addButton( buttonName,
				{
					label : buttonLabel,
					command : commandName
				});
		};

		var config = editor.config,
			lang = editor.lang;

		addButtonCommand( 'Bold'		, lang.bold		, 'bold'		, config.coreStyles_bold );
		addButtonCommand( 'Italic'		, lang.italic		, 'italic'		, config.coreStyles_italic );
		addButtonCommand( 'Underline'	, lang.underline		, 'underline'	, config.coreStyles_underline );
		addButtonCommand( 'StriKe'		, lang.striKe		, 'striKe'		, config.coreStyles_striKe );
		addButtonCommand( 'Subscript'	, lang.subscript		, 'subscript'	, config.coreStyles_subscript );
		addButtonCommand( 'Superscript'	, lang.superscript		, 'superscript'	, config.coreStyles_superscript );
	}
});

// Basic Inline Styles.

/**
 * The style definition to be used to apply the bold style in the text.
 * @type Object
 * @example
 * config.coreStyles_bold = { element : 'b', overrides : 'strong' };
 * @example
 * config.coreStyles_bold = { element : 'span', attributes : {'class': 'Bold'} };
 */
CKeDITOR.config.coreStyles_bold = { element : 'strong', overrides : 'b' };

/**
 * The style definition to be used to apply the italic style in the text.
 * @type Object
 * @default { element : 'em', overrides : 'i' }
 * @example
 * config.coreStyles_italic = { element : 'i', overrides : 'em' };
 * @example
 * CKeDITOR.config.coreStyles_italic = { element : 'span', attributes : {'class': 'Italic'} };
 */
CKeDITOR.config.coreStyles_italic = { element : 'em', overrides : 'i' };

/**
 * The style definition to be used to apply the underline style in the text.
 * @type Object
 * @default { element : 'u' }
 * @example
 * CKeDITOR.config.coreStyles_underline = { element : 'span', attributes : {'class': 'Underline'}};
 */
CKeDITOR.config.coreStyles_underline = { element : 'u' };

/**
 * The style definition to be used to apply the striKe style in the text.
 * @type Object
 * @default { element : 'striKe' }
 * @example
 * CKeDITOR.config.coreStyles_striKe = { element : 'span', attributes : {'class': 'StriKeThrough'}, overrides : 'striKe' };
 */
CKeDITOR.config.coreStyles_striKe = { element : 'striKe' };

/**
 * The style definition to be used to apply the subscript style in the text.
 * @type Object
 * @default { element : 'sub' }
 * @example
 * CKeDITOR.config.coreStyles_subscript = { element : 'span', attributes : {'class': 'Subscript'}, overrides : 'sub' };
 */
CKeDITOR.config.coreStyles_subscript = { element : 'sub' };

/**
 * The style definition to be used to apply the superscript style in the text.
 * @type Object
 * @default { element : 'sup' }
 * @example
 * CKeDITOR.config.coreStyles_superscript = { element : 'span', attributes : {'class': 'Superscript'}, overrides : 'sup' };
 */
CKeDITOR.config.coreStyles_superscript = { element : 'sup' };
