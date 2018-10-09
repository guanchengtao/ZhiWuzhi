/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Contains the third and last part of the {@link CKeDITOR} object
 *		definition.
 */

// Remove the CKeDITOR.loadFullCore reference defined on cKeditor_basic.
delete CKeDITOR.loadFullCore;

/**
 * Holds references to all editor instances created. The name of the properties
 * in this object correspond to instance names, and their values contains the
 * {@link CKeDITOR.editor} object representing them.
 * @type {Object}
 * @example
 * alert( <b>CKeDITOR.instances</b>.editor1.name );  // "editor1"
 */
CKeDITOR.instances = {};

/**
 * The document of the window holding the CKeDITOR object.
 * @type {CKeDITOR.dom.document}
 * @example
 * alert( <b>CKeDITOR.document</b>.getBody().getName() );  // "body"
 */
CKeDITOR.document = new CKeDITOR.dom.document( document );

/**
 * Adds an editor instance to the global {@link CKeDITOR} object. This function
 * is available for internal use mainly.
 * @param {CKeDITOR.editor} editor The editor instance to be added.
 * @example
 */
CKeDITOR.add = function( editor )
{
	CKeDITOR.instances[ editor.name ] = editor;

	editor.on( 'focus', function()
		{
			if ( CKeDITOR.currentInstance != editor )
			{
				CKeDITOR.currentInstance = editor;
				CKeDITOR.fire( 'currentInstance' );
			}
		});

	editor.on( 'blur', function()
		{
			if ( CKeDITOR.currentInstance == editor )
			{
				CKeDITOR.currentInstance = null;
				CKeDITOR.fire( 'currentInstance' );
			}
		});
};

/**
 * Removes an editor instance from the global {@link CKeDITOR} object. This function
 * is available for internal use only. External code must use {@link CKeDITOR.editor.prototype.destroy}
 * to avoid memory leaks.
 * @param {CKeDITOR.editor} editor The editor instance to be removed.
 * @example
 */
CKeDITOR.remove = function( editor )
{
	delete CKeDITOR.instances[ editor.name ];
};

/**
 * Perform global clean up to free as much memory as possible
 * when there are no instances left
 */
CKeDITOR.on( 'instanceDestroyed', function ()
	{
		if ( CKeDITOR.tools.isEmpty( this.instances ) )
			CKeDITOR.fire( 'reset' );
	});

// Load the bootstrap script.
CKeDITOR.loader.load( 'core/_bootstrap' );		// @Packager.RemoveLine

// Tri-state constants.

/**
 * Used to indicate the ON or ACTIVE state.
 * @constant
 * @example
 */
CKeDITOR.TRISTATE_ON = 1;

/**
 * Used to indicate the OFF or NON ACTIVE state.
 * @constant
 * @example
 */
CKeDITOR.TRISTATE_OFF = 2;

/**
 * Used to indicate DISABLED state.
 * @constant
 * @example
 */
CKeDITOR.TRISTATE_DISABLED = 0;

/**
 * The editor which is currently active (have user focus).
 * @name CKeDITOR.currentInstance
 * @type CKeDITOR.editor
 * @see CKeDITOR#currentInstance
 * @example
 * function showCurrentEditorName()
 * {
 *     if ( CKeDITOR.currentInstance )
 *         alert( CKeDITOR.currentInstance.name );
 *     else
 *         alert( 'Please focus an editor first.' );
 * }
 */

/**
 * Fired when the CKeDITOR.currentInstance object reference changes. This may
 * happen when setting the focus on different editor instances in the page.
 * @name CKeDITOR#currentInstance
 * @event
 * var editor;  // Variable to hold a reference to the current editor.
 * CKeDITOR.on( 'currentInstance' , function( e )
 *     {
 *         editor = CKeDITOR.currentInstance;
 *     });
 */

/**
 * Fired when the last instance has been destroyed. This event is used to perform
 * global memory clean up.
 * @name CKeDITOR#reset
 * @event
 */
