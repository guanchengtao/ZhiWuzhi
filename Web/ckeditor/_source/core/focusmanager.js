/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.focusManager} class, which is used
 *		to handle the focus on editor instances..
 */

/**
 * Creates a focusManager class instance.
 * @class Manages the focus activity in an editor instance. This class is to be
 * used mainly by UI elements coders when adding interface elements that need
 * to set the focus state of the editor.
 * @param {CKeDITOR.editor} editor The editor instance.
 * @example
 * var focusManager = <b>new CKeDITOR.focusManager( editor )</b>;
 * focusManager.focus();
 */
CKeDITOR.focusManager = function( editor )
{
	if ( editor.focusManager )
		return editor.focusManager;

	/**
	 * Indicates that the editor instance has focus.
	 * @type Boolean
	 * @example
	 * alert( CKeDITOR.instances.editor1.focusManager.hasFocus );  // e.g "true"
	 */
	this.hasFocus = false;

	/**
	 * Object used to hold private stuff.
	 * @private
	 */
	this._ =
	{
		editor : editor
	};

	return this;
};

CKeDITOR.focusManager.prototype =
{
	/**
	 * Used to indicate that the editor instance has the focus.<br />
	 * <br />
	 * Note that this function will not explicitelly set the focus in the
	 * editor (for example, making the caret blinking on it). Use
	 * {@link CKeDITOR.editor#focus} for it instead.
	 * @example
	 * var editor = CKeDITOR.instances.editor1;
	 * <b>editor.focusManager.focus()</b>;
	 */
	focus : function()
	{
		if ( this._.timer )
			clearTimeout( this._.timer );

		if ( !this.hasFocus )
		{
			// If another editor has the current focus, we first "blur" it. In
			// this way the events happen in a more logical sequence, liKe:
			//		"focus 1" > "blur 1" > "focus 2"
			// ... instead of:
			//		"focus 1" > "focus 2" > "blur 1"
			if ( CKeDITOR.currentInstance )
				CKeDITOR.currentInstance.focusManager.forceBlur();

			var editor = this._.editor;

			editor.container.getChild( 1 ).addClass( 'cKe_focus' );

			this.hasFocus = true;
			editor.fire( 'focus' );
		}
	},

	/**
	 * Used to indicate that the editor instance has lost the focus.<br />
	 * <br />
	 * Note that this functions acts asynchronously with a delay of 100ms to
	 * avoid subsequent blur/focus effects. If you want the "blur" to happen
	 * immediately, use the {@link #forceBlur} function instead.
	 * @example
	 * var editor = CKeDITOR.instances.editor1;
	 * <b>editor.focusManager.blur()</b>;
	 */
	blur : function()
	{
		var focusManager = this;

		if ( focusManager._.timer )
			clearTimeout( focusManager._.timer );

		focusManager._.timer = setTimeout(
			function()
			{
				delete focusManager._.timer;
				focusManager.forceBlur();
			}
			, 100 );
	},

	/**
	 * Used to indicate that the editor instance has lost the focus. UnliKe
	 * {@link #blur}, this function is synchronous, marking the instance as
	 * "blured" immediately.
	 * @example
	 * var editor = CKeDITOR.instances.editor1;
	 * <b>editor.focusManager.forceBlur()</b>;
	 */
	forceBlur : function()
	{
		if ( this.hasFocus )
		{
			var editor = this._.editor;

			editor.container.getChild( 1 ).removeClass( 'cKe_focus' );

			this.hasFocus = false;
			editor.fire( 'blur' );
		}
	}
};

/**
 * Fired when the editor instance receives the input focus.
 * @name CKeDITOR.editor#focus
 * @event
 * @param {CKeDITOR.editor} editor The editor instance.
 * @example
 * editor.on( 'focus', function( e )
 *     {
 *         alert( 'The editor named ' + e.editor.name + ' is now focused' );
 *     });
 */

/**
 * Fired when the editor instance loses the input focus.
 * @name CKeDITOR.editor#blur
 * @event
 * @param {CKeDITOR.editor} editor The editor instance.
 * @example
 * editor.on( 'blur', function( e )
 *     {
 *         alert( 'The editor named ' + e.editor.name + ' lost the focus' );
 *     });
 */
