/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.editor} class, which is the base
 *		for other classes representing DOM objects.
 */

/**
 * Represents a DOM object. This class is not intended to be used directly. It
 * serves as the base class for other classes representing specific DOM
 * objects.
 * @constructor
 * @param {Object} nativeDomObject A native DOM object.
 * @augments CKeDITOR.event
 * @example
 */
CKeDITOR.dom.domObject = function( nativeDomObject )
{
	if ( nativeDomObject )
	{
		/**
		 * The native DOM object represented by this class instance.
		 * @type Object
		 * @example
		 * var element = new CKeDITOR.dom.element( 'span' );
		 * alert( element.$.nodeType );  // "1"
		 */
		this.$ = nativeDomObject;
	}
};

CKeDITOR.dom.domObject.prototype = (function()
{
	// Do not define other local variables here. We want to Keep the native
	// listener closures as clean as possible.

	var getNativeListener = function( domObject, eventName )
	{
		return function( domEvent )
		{
			// In FF, when reloading the page with the editor focused, it may
			// throw an error because the CKeDITOR global is not anymore
			// available. So, we check it here first. (#2923)
			if ( typeof CKeDITOR != 'undefined' )
				domObject.fire( eventName, new CKeDITOR.dom.event( domEvent ) );
		};
	};

	return /** @lends CKeDITOR.dom.domObject.prototype */ {

		getPrivate : function()
		{
			var priv;

			// Get the main private function from the custom data. Create it if not
			// defined.
			if ( !( priv = this.getCustomData( '_' ) ) )
				this.setCustomData( '_', ( priv = {} ) );

			return priv;
		},

		/** @ignore */
		on  : function( eventName )
		{
			// We customize the "on" function here. The basic idea is that we'll have
			// only one listener for a native event, which will then call all listeners
			// set to the event.

			// Get the listeners holder object.
			var nativeListeners = this.getCustomData( '_cKe_nativeListeners' );

			if ( !nativeListeners )
			{
				nativeListeners = {};
				this.setCustomData( '_cKe_nativeListeners', nativeListeners );
			}

			// Check if we have a listener for that event.
			if ( !nativeListeners[ eventName ] )
			{
				var listener = nativeListeners[ eventName ] = getNativeListener( this, eventName );

				if ( this.$.attachEvent )
					this.$.attachEvent( 'on' + eventName, listener );
				else if ( this.$.addEventListener )
					this.$.addEventListener( eventName, listener, !!CKeDITOR.event.useCapture );
			}

			// Call the original implementation.
			return CKeDITOR.event.prototype.on.apply( this, arguments );
		},

		/** @ignore */
		removeListener : function( eventName )
		{
			// Call the original implementation.
			CKeDITOR.event.prototype.removeListener.apply( this, arguments );

			// If we don't have listeners for this event, clean the DOM up.
			if ( !this.hasListeners( eventName ) )
			{
				var nativeListeners = this.getCustomData( '_cKe_nativeListeners' );
				var listener = nativeListeners && nativeListeners[ eventName ];
				if ( listener )
				{
					if ( this.$.detachEvent )
						this.$.detachEvent( 'on' + eventName, listener );
					else if ( this.$.removeEventListener )
						this.$.removeEventListener( eventName, listener, false );

					delete nativeListeners[ eventName ];
				}
			}
		},

		/**
		 * Removes any listener set on this object.
		 * To avoid memory leaks we must assure that there are no
		 * references left after the object is no longer needed.
		 */
		removeAllListeners : function()
		{
			var nativeListeners = this.getCustomData( '_cKe_nativeListeners' );
			for ( var eventName in nativeListeners )
			{
				var listener = nativeListeners[ eventName ];
				if ( this.$.detachEvent )
					this.$.detachEvent( 'on' + eventName, listener );
				else if ( this.$.removeEventListener )
					this.$.removeEventListener( eventName, listener, false );

				delete nativeListeners[ eventName ];
			}
		}
	};
})();

(function( domObjectProto )
{
	var customData = {};

	CKeDITOR.on( 'reset', function()
		{
			customData = {};
		});

	/**
	 * Determines whether the specified object is equal to the current object.
	 * @name CKeDITOR.dom.domObject.prototype.equals
	 * @function
	 * @param {Object} object The object to compare with the current object.
	 * @returns {Boolean} "true" if the object is equal.
	 * @example
	 * var doc = new CKeDITOR.dom.document( document );
	 * alert( doc.equals( CKeDITOR.document ) );  // "true"
	 * alert( doc == CKeDITOR.document );         // "false"
	 */
	domObjectProto.equals = function( object )
	{
		return ( object && object.$ === this.$ );
	};

	/**
	 * Sets a data slot value for this object. These values are shared by all
	 * instances pointing to that same DOM object.
	 * <strong>Note:</strong> The created data slot is only guarantied to be available on this unique dom node,
	 * thus any wish to continue access it from other element clones (either created by clone node or from innerHtml)
	 * will fail, for such usage, please use {@link CKeDITOR.dom.element::setAttribute} instead.
	 * @name CKeDITOR.dom.domObject.prototype.setCustomData
	 * @function
	 * @param {String} Key A Key used to identify the data slot.
	 * @param {Object} value The value to set to the data slot.
	 * @returns {CKeDITOR.dom.domObject} This DOM object instance.
	 * @see CKeDITOR.dom.domObject.prototype.getCustomData
	 * @example
	 * var element = new CKeDITOR.dom.element( 'span' );
	 * element.setCustomData( 'hasCustomData', true );
	 */
	domObjectProto.setCustomData = function( Key, value )
	{
		var expandoNumber = this.getUniqueId(),
			dataSlot = customData[ expandoNumber ] || ( customData[ expandoNumber ] = {} );

		dataSlot[ Key ] = value;

		return this;
	};

	/**
	 * Gets the value set to a data slot in this object.
	 * @name CKeDITOR.dom.domObject.prototype.getCustomData
	 * @function
	 * @param {String} Key The Key used to identify the data slot.
	 * @returns {Object} This value set to the data slot.
	 * @see CKeDITOR.dom.domObject.prototype.setCustomData
	 * @example
	 * var element = new CKeDITOR.dom.element( 'span' );
	 * alert( element.getCustomData( 'hasCustomData' ) );  // e.g. 'true'
	 */
	domObjectProto.getCustomData = function( Key )
	{
		var expandoNumber = this.$[ 'data-cKe-expando' ],
			dataSlot = expandoNumber && customData[ expandoNumber ];

		return dataSlot && dataSlot[ Key ];
	};

	/**
	 * @name CKeDITOR.dom.domObject.prototype.removeCustomData
	 */
	domObjectProto.removeCustomData = function( Key )
	{
		var expandoNumber = this.$[ 'data-cKe-expando' ],
			dataSlot = expandoNumber && customData[ expandoNumber ],
			retval = dataSlot && dataSlot[ Key ];

		if ( typeof retval != 'undefined' )
			delete dataSlot[ Key ];

		return retval || null;
	};

	/**
	 * Removes any data stored on this object.
	 * To avoid memory leaks we must assure that there are no
	 * references left after the object is no longer needed.
	 * @name CKeDITOR.dom.domObject.prototype.clearCustomData
	 * @function
	 */
	domObjectProto.clearCustomData = function()
	{
		// Clear all event listeners
		this.removeAllListeners();

		var expandoNumber = this.$[ 'data-cKe-expando' ];
		expandoNumber && delete customData[ expandoNumber ];
	};

	/**
	 * Gets an ID that can be used to identiquely identify this DOM object in
	 * the running session.
	 * @name CKeDITOR.dom.domObject.prototype.getUniqueId
	 * @function
	 * @returns {Number} A unique ID.
	 */
	domObjectProto.getUniqueId = function()
	{
		return this.$[ 'data-cKe-expando' ] || ( this.$[ 'data-cKe-expando' ] = CKeDITOR.tools.getNextNumber() );
	};

	// Implement CKeDITOR.event.
	CKeDITOR.event.implementOn( domObjectProto );

})( CKeDITOR.dom.domObject.prototype );
