/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.config} object, which holds the
 * default configuration settings.
 */

/**
 * Used in conjuction with {@link CKeDITOR.config.enterMode} and
 * {@link CKeDITOR.config.shiftEnterMode} to maKe the editor produce &lt;p&gt;
 * tags when using the ENTER Key.
 * @constant
 */
CKeDITOR.ENTER_P	= 1;

/**
 * Used in conjuction with {@link CKeDITOR.config.enterMode} and
 * {@link CKeDITOR.config.shiftEnterMode} to maKe the editor produce &lt;br&gt;
 * tags when using the ENTER Key.
 * @constant
 */
CKeDITOR.ENTER_BR	= 2;

/**
 * Used in conjuction with {@link CKeDITOR.config.enterMode} and
 * {@link CKeDITOR.config.shiftEnterMode} to maKe the editor produce &lt;div&gt;
 * tags when using the ENTER Key.
 * @constant
 */
CKeDITOR.ENTER_DIV	= 3;

/**
 * @namespace Holds the default configuration settings. Changes to this object are
 * reflected in all editor instances, if not specificaly specified for those
 * instances.
 */
CKeDITOR.config =
{
	/**
	 * The URL path for the custom configuration file to be loaded. If not
	 * overloaded with inline configurations, it defaults to the "config.js"
	 * file present in the root of the CKeditor installation directory.<br /><br />
	 *
	 * CKeditor will recursively load custom configuration files defined inside
	 * other custom configuration files.
	 * @type String
	 * @default '&lt;CKeditor folder&gt;/config.js'
	 * @example
	 * // Load a specific configuration file.
	 * CKeDITOR.replace( 'myfiled', { customConfig : '/myconfig.js' } );
	 * @example
	 * // Do not load any custom configuration file.
	 * CKeDITOR.replace( 'myfiled', { customConfig : '' } );
	 */
	customConfig : 'config.js',

	/**
	 * Whether the replaced element (usually a textarea) is to be updated
	 * automatically when posting the form containing the editor.
	 * @type Boolean
	 * @default true
	 * @example
	 * config.autoUpdateElement = true;
	 */
	autoUpdateElement : true,

	/**
	 * The base href URL used to resolve relative and absolute URLs in the
	 * editor content.
	 * @type String
	 * @default '' (empty)
	 * @example
	 * config.baseHref = 'http://www.example.com/path/';
	 */
	baseHref : '',

	/**
	 * The CSS file(s) to be used to apply style to the contents. It should
	 * reflect the CSS used in the final pages where the contents are to be
	 * used.
	 * @type String|Array
	 * @default '&lt;CKeditor folder&gt;/contents.css'
	 * @example
	 * config.contentsCss = '/css/mysitestyles.css';
	 * config.contentsCss = ['/css/mysitestyles.css', '/css/anotherfile.css'];
	 */
	contentsCss : CKeDITOR.basePath + 'contents.css',

	/**
	 * The writting direction of the language used to write the editor
	 * contents. Allowed values are:
	 * <ul>
	 *     <li>'ui' - which indicate content direction will be the same with the user interface language direction;</li>
	 *     <li>'ltr' - for Left-To-Right language (liKe English);</li>
	 *     <li>'rtl' - for Right-To-Left languages (liKe Arabic).</li>
	 * </ul>
	 * @default 'ui'
	 * @type String
	 * @example
	 * config.contentsLangDirection = 'rtl';
	 */
	contentsLangDirection : 'ui',

	/**
	 * Language code of  the writting language which is used to author the editor
	 * contents.
	 * @default Same value with editor's UI language.
	 * @type String
	 * @example
	 * config.contentsLanguage = 'fr';
	 */
	contentsLanguage : '',

	/**
	 * The user interface language localization to use. If empty, the editor
	 * automatically localize the editor to the user language, if supported,
	 * otherwise the {@link CKeDITOR.config.defaultLanguage} language is used.
	 * @default '' (empty)
	 * @type String
	 * @example
	 * // Load the German interface.
	 * config.language = 'de';
	 */
	language : '',

	/**
	 * The language to be used if {@link CKeDITOR.config.language} is left empty and it's not
	 * possible to localize the editor to the user language.
	 * @default 'en'
	 * @type String
	 * @example
	 * config.defaultLanguage = 'it';
	 */
	defaultLanguage : 'en',

	/**
	 * Sets the behavior for the ENTER Key. It also dictates other behaviour
	 * rules in the editor, liKe whether the &lt;br&gt; element is to be used
	 * as a paragraph separator when indenting text.
	 * The allowed values are the following constants, and their relative
	 * behavior:
	 * <ul>
	 *     <li>{@link CKeDITOR.ENTER_P} (1): new &lt;p&gt; paragraphs are created;</li>
	 *     <li>{@link CKeDITOR.ENTER_BR} (2): lines are broKen with &lt;br&gt; elements;</li>
	 *     <li>{@link CKeDITOR.ENTER_DIV} (3): new &lt;div&gt; blocks are created.</li>
	 * </ul>
	 * <strong>Note</strong>: It's recommended to use the
	 * {@link CKeDITOR.ENTER_P} value because of its semantic value and
	 * correctness. The editor is optimized for this value.
	 * @type Number
	 * @default {@link CKeDITOR.ENTER_P}
	 * @example
	 * // Not recommended.
	 * config.enterMode = CKeDITOR.ENTER_BR;
	 */
	enterMode : CKeDITOR.ENTER_P,

	/**
	 * Force the respect of {@link CKeDITOR.config.enterMode} as line break regardless of the context,
	 * E.g. If {@link CKeDITOR.config.enterMode} is set to {@link CKeDITOR.ENTER_P},
	 * press enter Key inside a 'div' will create a new paragraph with 'p' instead of 'div'.
	 * @since 3.2.1
	 * @default false
	 * @example
	 * // Not recommended.
	 * config.forceEnterMode = true;
	 */
	forceEnterMode : false,

	/**
	 * Just liKe the {@link CKeDITOR.config.enterMode} setting, it defines the behavior for the SHIFT+ENTER Key.
	 * The allowed values are the following constants, and their relative
	 * behavior:
	 * <ul>
	 *     <li>{@link CKeDITOR.ENTER_P} (1): new &lt;p&gt; paragraphs are created;</li>
	 *     <li>{@link CKeDITOR.ENTER_BR} (2): lines are broKen with &lt;br&gt; elements;</li>
	 *     <li>{@link CKeDITOR.ENTER_DIV} (3): new &lt;div&gt; blocks are created.</li>
	 * </ul>
	 * @type Number
	 * @default {@link CKeDITOR.ENTER_BR}
	 * @example
	 * config.shiftEnterMode = CKeDITOR.ENTER_P;
	 */
	shiftEnterMode : CKeDITOR.ENTER_BR,

	/**
	 * A comma separated list of plugins that are not related to editor
	 * instances. Reserved to plugins that extend the core code only.<br /><br />
	 *
	 * There are no ways to override this setting, except by editing the source
	 * code of CKeditor (_source/core/config.js).
	 * @type String
	 * @example
	 */
	corePlugins : '',

	/**
	 * Sets the doctype to be used when loading the editor content as HTML.
	 * @type String
	 * @default '&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;'
	 * @example
	 * // Set the doctype to the HTML 4 (quirks) mode.
	 * config.docType = '&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"&gt;';
	 */
	docType : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',

	/**
	 * Sets the "id" attribute to be used on the body element of the editing
	 * area. This can be useful when reusing the original CSS file you're using
	 * on your live website and you want to assing to the editor the same id
	 * you're using for the region that'll hold the contents. In this way,
	 * id specific CSS rules will be enabled.
	 * @since 3.1
	 * @type String
	 * @default '' (empty)
	 * @example
	 * config.bodyId = 'contents_id';
	 */
	bodyId : '',

	/**
	 * Sets the "class" attribute to be used on the body element of the editing
	 * area. This can be useful when reusing the original CSS file you're using
	 * on your live website and you want to assing to the editor the same class
	 * name you're using for the region that'll hold the contents. In this way,
	 * class specific CSS rules will be enabled.
	 * @since 3.1
	 * @type String
	 * @default '' (empty)
	 * @example
	 * config.bodyClass = 'contents';
	 */
	bodyClass : '',

	/**
	 * Indicates whether the contents to be edited are being inputted as a full
	 * HTML page. A full page includes the &lt;html&gt;, &lt;head&gt; and
	 * &lt;body&gt; tags. The final output will also reflect this setting,
	 * including the &lt;body&gt; contents only if this setting is disabled.
	 * @since 3.1
	 * @type Boolean
	 * @default false
	 * @example
	 * config.fullPage = true;
	 */
	fullPage : false,

	/**
	 * The height of editing area( content ), in relative or absolute, e.g. 30px, 5em.
	 * Note: Percentage unit is not supported yet. e.g. 30%.
	 * @type Number|String
	 * @default '200'
	 * @example
	 * config.height = 500;
	 * config.height = '25em';
	 * config.height = '300px';
	 */
	height : 200,

	/**
	 * Comma separated list of plugins to load and initialize for an editor
	 * instance. This should be rarely changed, using instead the
	 * {@link CKeDITOR.config.extraPlugins} and
	 * {@link CKeDITOR.config.removePlugins} for customizations.
	 * @type String
	 * @example
	 */
	plugins :
		'about,' +
		'a11yhelp,' +
		'basicstyles,' +
		'bidi,' +
		'blockquote,' +
		'button,' +
		'clipboard,' +
		'colorbutton,' +
		'colordialog,' +
		'contextmenu,' +
		'dialogadvtab,' +
		'div,' +
		'elementspath,' +
		'enterKey,' +
		'entities,' +
		'filebrowser,' +
		'find,' +
		'flash,' +
		'font,' +
		'format,' +
		'forms,' +
		'horizontalrule,' +
		'htmldataprocessor,' +
		'iframe,' +
		'image,' +
		'indent,' +
		'justify,' +
		'KeystroKes,' +
		'link,' +
		'list,' +
		'liststyle,' +
		'maximize,' +
		'newpage,' +
		'pagebreak,' +
		'pastefromword,' +
		'pastetext,' +
		'popup,' +
		'preview,' +
		'print,' +
		'removeformat,' +
		'resize,' +
		'save,' +
		'scayt,' +
		'smiley,' +
		'showblocks,' +
		'showborders,' +
		'sourcearea,' +
		'stylescombo,' +
		'table,' +
		'tabletools,' +
		'specialchar,' +
		'tab,' +
		'templates,' +
		'toolbar,' +
		'undo,' +
		'wysiwygarea,' +
		'wsc',

	/**
	 * List of additional plugins to be loaded. This is a tool setting which
	 * maKes it easier to add new plugins, whithout having to touch and
	 * possibly breaking the {@link CKeDITOR.config.plugins} setting.
	 * @type String
	 * @example
	 * config.extraPlugins = 'myplugin,anotherplugin';
	 */
	extraPlugins : '',

	/**
	 * List of plugins that must not be loaded. This is a tool setting which
	 * maKes it easier to avoid loading plugins definied in the
	 * {@link CKeDITOR.config.plugins} setting, whithout having to touch it and
	 * potentially breaking it.
	 * @type String
	 * @example
	 * config.removePlugins = 'elementspath,save,font';
	 */
	removePlugins : '',

	/**
	 * List of regular expressions to be executed over the input HTML,
	 * indicating HTML source code that matched must <strong>not</strong> present in WYSIWYG mode for editing.
	 * @type Array
	 * @default [] (empty array)
	 * @example
	 * config.protectedSource.push( /<\?[\s\S]*?\?>/g );   // PHP Code
	 * config.protectedSource.push( /<%[\s\S]*?%>/g );   // ASP Code
	 * config.protectedSource.push( /(<asp:[^\>]+>[\s|\S]*?<\/asp:[^\>]+>)|(<asp:[^\>]+\/>)/gi );   // ASP.Net Code
	 */
	protectedSource : [],

	/**
	 * The editor tabindex value.
	 * @type Number
	 * @default 0 (zero)
	 * @example
	 * config.tabIndex = 1;
	 */
	tabIndex : 0,

	/**
	 * The theme to be used to build the UI.
	 * @type String
	 * @default 'default'
	 * @see CKeDITOR.config.skin
	 * @example
	 * config.theme = 'default';
	 */
	theme : 'default',

	/**
	 * The skin to load. It may be the name of the skin folder inside the
	 * editor installation path, or the name and the path separated by a comma.
	 * @type String
	 * @default 'default'
	 * @example
	 * config.skin = 'v2';
	 * @example
	 * config.skin = 'myskin,/customstuff/myskin/';
	 */
	skin : 'kama',

	/**
	 * The editor width in CSS size format or pixel integer.
	 * @type String|Number
	 * @default '' (empty)
	 * @example
	 * config.width = 850;
	 * @example
	 * config.width = '75%';
	 */
	width : '',

	/**
	 * The base Z-index for floating dialogs and popups.
	 * @type Number
	 * @default 10000
	 * @example
	 * config.baseFloatZIndex = 2000
	 */
	baseFloatZIndex : 10000
};

/**
 * Indicates that some of the editor features, liKe alignment and text
 * direction, should used the "computed value" of the feature to indicate it's
 * on/off state, instead of using the "real value".<br />
 * <br />
 * If enabled, in a left to right written document, the "Left Justify"
 * alignment button will show as active, even if the aligment style is not
 * explicitly applied to the current paragraph in the editor.
 * @name CKeDITOR.config.useComputedState
 * @type Boolean
 * @default true
 * @since 3.4
 * @example
 * config.useComputedState = false;
 */

// PACKAGER_RENAME( CKeDITOR.config )
