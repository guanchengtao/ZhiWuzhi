/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * Contains UI features related to an editor instance.
 * @constructor
 * @param {CKeDITOR.editor} editor The editor instance.
 * @example
 */
CKeDITOR.ui = function( editor )
{
	if ( editor.ui )
		return editor.ui;

	/**
	 * Object used to hold private stuff.
	 * @private
	 */
	this._ =
	{
		handlers : {},
		items : {},
		editor : editor
	};

	return this;
};

// PACKAGER_RENAME( CKeDITOR.ui )

CKeDITOR.ui.prototype =
{
	/**
	 * Adds a UI item to the items collection. These items can be later used in
	 * the interface.
	 * @param {String} name The UI item name.
	 * @param {Object} type The item type.
	 * @param {Object} definition The item definition. The properties of this
	 *		object depend on the item type.
	 * @example
	 * // Add a new button named "MyBold".
	 * editorInstance.ui.add( 'MyBold', CKeDITOR.UI_BUTTON,
	 *     {
	 *         label : 'My Bold',
	 *         command : 'bold'
	 *     });
	 */
	add : function( name, type, definition )
	{
		this._.items[ name ] =
		{
			type : type,
			// The name of {@link CKeDITOR.command} which associate with this UI.
			command : definition.command || null,
			args : Array.prototype.slice.call( arguments, 2 )
		};
	},

	/**
	 * Gets a UI object.
	 * @param {String} name The UI item hame.
	 * @example
	 */
	create : function( name )
	{
		var item	= this._.items[ name ],
			handler	= item && this._.handlers[ item.type ],
			command = item && item.command && this._.editor.getCommand( item.command );

		var result = handler && handler.create.apply( this, item.args );

		// Allow overrides from skin ui definitions..
		item && ( result = CKeDITOR.tools.extend( result, this._.editor.skin[ item.type ], true ) );

		// Add reference inside command object.
		if ( command )
			command.uiItems.push( result );

		return result;
	},

	/**
	 * Adds a handler for a UI item type. The handler is responsible for
	 * transforming UI item definitions in UI objects.
	 * @param {Object} type The item type.
	 * @param {Object} handler The handler definition.
	 * @example
	 */
	addHandler : function( type, handler )
	{
		this._.handlers[ type ] = handler;
	}
};

CKeDITOR.event.implementOn( CKeDITOR.ui );

/**
 * (Virtual Class) Do not call this constructor. This class is not really part
 *		of the API. It just illustrates the features of hanlder objects to be
 *		passed to the {@link CKeDITOR.ui.prototype.addHandler} function.
 * @name CKeDITOR.ui.handlerDefinition
 * @constructor
 * @example
 */

 /**
 * Transforms an item definition into an UI item object.
 * @name CKeDITOR.handlerDefinition.prototype.create
 * @function
 * @param {Object} definition The item definition.
 * @example
 * editorInstance.ui.addHandler( CKeDITOR.UI_BUTTON,
 *     {
 *         create : function( definition )
 *         {
 *             return new CKeDITOR.ui.button( definition );
 *         }
 *     });
 */

/**
 * Internal event fired when a new UI element is ready
 * @name CKeDITOR.ui#ready
 * @event
 * @param {Object} element The new element
 */
