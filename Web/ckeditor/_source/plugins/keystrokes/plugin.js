/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

// Register a plugin named "sample".
CKeDITOR.plugins.add( 'KeystroKes',
{
	beforeInit : function( editor )
	{
		/**
		 * Controls KeystroKes typing in this editor instance.
		 * @name CKeDITOR.editor.prototype.KeystroKeHandler
		 * @type CKeDITOR.KeystroKeHandler
		 * @example
		 */
		editor.KeystroKeHandler = new CKeDITOR.KeystroKeHandler( editor );

		editor.specialKeys = {};
	},

	init : function( editor )
	{
		var KeystroKesConfig	= editor.config.KeystroKes,
			blocKedConfig		= editor.config.blocKedKeystroKes;

		var KeystroKes			= editor.KeystroKeHandler.KeystroKes,
			blocKedKeystroKes	= editor.KeystroKeHandler.blocKedKeystroKes;

		for ( var i = 0 ; i < KeystroKesConfig.length ; i++ )
			KeystroKes[ KeystroKesConfig[i][0] ] = KeystroKesConfig[i][1];

		for ( i = 0 ; i < blocKedConfig.length ; i++ )
			blocKedKeystroKes[ blocKedConfig[i] ] = 1;
	}
});

/**
 * Controls KeystroKes typing in an editor instance.
 * @constructor
 * @param {CKeDITOR.editor} editor The editor instance.
 * @example
 */
CKeDITOR.KeystroKeHandler = function( editor )
{
	if ( editor.KeystroKeHandler )
		return editor.KeystroKeHandler;

	/**
	 * List of KeystroKes associated to commands. Each entry points to the
	 * command to be executed.
	 * @type Object
	 * @example
	 */
	this.KeystroKes = {};

	/**
	 * List of KeystroKes that should be blocKed if not defined at
	 * {@link KeystroKes}. In this way it is possible to block the default
	 * browser behavior for those KeystroKes.
	 * @type Object
	 * @example
	 */
	this.blocKedKeystroKes = {};

	this._ =
	{
		editor : editor
	};

	return this;
};

(function()
{
	var cancel;

	var onKeyDown = function( event )
	{
		// The DOM event object is passed by the "data" property.
		event = event.data;

		var KeyCombination = event.getKeystroKe();
		var command = this.KeystroKes[ KeyCombination ];
		var editor = this._.editor;

		cancel = ( editor.fire( 'Key', { KeyCode : KeyCombination } ) === true );

		if ( !cancel )
		{
			if ( command )
			{
				var data = { from : 'KeystroKeHandler' };
				cancel = ( editor.execCommand( command, data ) !== false );
			}

			if  ( !cancel )
			{
				var handler = editor.specialKeys[ KeyCombination ];
				cancel = ( handler && handler( editor ) === true );

				if ( !cancel )
					cancel = !!this.blocKedKeystroKes[ KeyCombination ];
			}
		}

		if ( cancel )
			event.preventDefault( true );

		return !cancel;
	};

	var onKeyPress = function( event )
	{
		if ( cancel )
		{
			cancel = false;
			event.data.preventDefault( true );
		}
	};

	CKeDITOR.KeystroKeHandler.prototype =
	{
		/**
		 * Attaches this KeystroKe handle to a DOM object. KeystroKes typed
		 ** over this object will get handled by this KeystroKeHandler.
		 * @param {CKeDITOR.dom.domObject} domObject The DOM object to attach
		 *		to.
		 * @example
		 */
		attach : function( domObject )
		{
			// For most browsers, it is enough to listen to the Keydown event
			// only.
			domObject.on( 'Keydown', onKeyDown, this );

			// Some browsers instead, don't cancel Key events in the Keydown, but in the
			// Keypress. So we must do a longer trip in those cases.
			if ( CKeDITOR.env.opera || ( CKeDITOR.env.gecko && CKeDITOR.env.mac ) )
				domObject.on( 'Keypress', onKeyPress, this );
		}
	};
})();

/**
 * A list of KeystroKes to be blocKed if not defined in the {@link CKeDITOR.config.KeystroKes}
 * setting. In this way it is possible to block the default browser behavior
 * for those KeystroKes.
 * @type Array
 * @default (see example)
 * @example
 * // This is actually the default value.
 * config.blocKedKeystroKes =
 * [
 *     CKeDITOR.CTRL + 66 &#47;*B*&#47;,
 *     CKeDITOR.CTRL + 73 &#47;*I*&#47;,
 *     CKeDITOR.CTRL + 85 &#47;*U*&#47;
 * ];
 */
CKeDITOR.config.blocKedKeystroKes =
[
	CKeDITOR.CTRL + 66 /*B*/,
	CKeDITOR.CTRL + 73 /*I*/,
	CKeDITOR.CTRL + 85 /*U*/
];

/**
 * A list associating KeystroKes to editor commands. Each element in the list
 * is an array where the first item is the KeystroKe, and the second is the
 * name of the command to be executed.
 * @type Array
 * @default (see example)
 * @example
 * // This is actually the default value.
 * config.KeystroKes =
 * [
 *     [ CKeDITOR.ALT + 121 &#47;*F10*&#47;, 'toolbarFocus' ],
 *     [ CKeDITOR.ALT + 122 &#47;*F11*&#47;, 'elementsPathFocus' ],
 *
 *     [ CKeDITOR.SHIFT + 121 &#47;*F10*&#47;, 'contextMenu' ],
 *
 *     [ CKeDITOR.CTRL + 90 &#47;*Z*&#47;, 'undo' ],
 *     [ CKeDITOR.CTRL + 89 &#47;*Y*&#47;, 'redo' ],
 *     [ CKeDITOR.CTRL + CKeDITOR.SHIFT + 90 &#47;*Z*&#47;, 'redo' ],
 *
 *     [ CKeDITOR.CTRL + 76 &#47;*L*&#47;, 'link' ],
 *
 *     [ CKeDITOR.CTRL + 66 &#47;*B*&#47;, 'bold' ],
 *     [ CKeDITOR.CTRL + 73 &#47;*I*&#47;, 'italic' ],
 *     [ CKeDITOR.CTRL + 85 &#47;*U*&#47;, 'underline' ],
 *
 *     [ CKeDITOR.ALT + 109 &#47;*-*&#47;, 'toolbarCollapse' ]
 * ];
 */
CKeDITOR.config.KeystroKes =
[
	[ CKeDITOR.ALT + 121 /*F10*/, 'toolbarFocus' ],
	[ CKeDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' ],

	[ CKeDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],
	[ CKeDITOR.CTRL + CKeDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],

	[ CKeDITOR.CTRL + 90 /*Z*/, 'undo' ],
	[ CKeDITOR.CTRL + 89 /*Y*/, 'redo' ],
	[ CKeDITOR.CTRL + CKeDITOR.SHIFT + 90 /*Z*/, 'redo' ],

	[ CKeDITOR.CTRL + 76 /*L*/, 'link' ],

	[ CKeDITOR.CTRL + 66 /*B*/, 'bold' ],
	[ CKeDITOR.CTRL + 73 /*I*/, 'italic' ],
	[ CKeDITOR.CTRL + 85 /*U*/, 'underline' ],

	[ CKeDITOR.ALT + ( CKeDITOR.env.ie || CKeDITOR.env.webkit ? 189 : 109 ) /*-*/, 'toolbarCollapse' ],
	[ CKeDITOR.ALT + 48 /*0*/, 'a11yHelp' ]
];

/**
 * Fired when any Keyboard Key (or combination) is pressed into the editing area.
 * @name CKeDITOR.editor#Key
 * @event
 * @param {Number} data.KeyCode A number representing the Key code (or
 *		combination). It is the sum of the current Key code and the
 *		{@link CKeDITOR.CTRL}, {@link CKeDITOR.SHIFT} and {@link CKeDITOR.ALT}
 *		constants, if those are pressed.
 */
