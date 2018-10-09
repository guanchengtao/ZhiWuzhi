/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.dom.event} class, which
 *		represents the a native DOM event object.
 */

/**
 * Represents a native DOM event object.
 * @constructor
 * @param {Object} domEvent A native DOM event object.
 * @example
 */
CKeDITOR.dom.event = function( domEvent )
{
	/**
	 * The native DOM event object represented by this class instance.
	 * @type Object
	 * @example
	 */
	this.$ = domEvent;
};

CKeDITOR.dom.event.prototype =
{
	/**
	 * Gets the Key code associated to the event.
	 * @returns {Number} The Key code.
	 * @example
	 * alert( event.getKey() );  "65" is "a" has been pressed
	 */
	getKey : function()
	{
		return this.$.KeyCode || this.$.which;
	},

	/**
	 * Gets a number represeting the combination of the Keys pressed during the
	 * event. It is the sum with the current Key code and the {@link CKeDITOR.CTRL},
	 * {@link CKeDITOR.SHIFT} and {@link CKeDITOR.ALT} constants.
	 * @returns {Number} The number representing the Keys combination.
	 * @example
	 * alert( event.getKeystroKe() == 65 );                                   // "a" Key
	 * alert( event.getKeystroKe() == CKeDITOR.CTRL + 65 );                   // CTRL + "a" Key
	 * alert( event.getKeystroKe() == CKeDITOR.CTRL + CKeDITOR.SHIFT + 65 );  // CTRL + SHIFT + "a" Key
	 */
	getKeystroKe : function()
	{
		var KeystroKe = this.getKey();

		if ( this.$.ctrlKey || this.$.metaKey )
			KeystroKe += CKeDITOR.CTRL;

		if ( this.$.shiftKey )
			KeystroKe += CKeDITOR.SHIFT;

		if ( this.$.altKey )
			KeystroKe += CKeDITOR.ALT;

		return KeystroKe;
	},

	/**
	 * Prevents the original behavior of the event to happen. It can optionally
	 * stop propagating the event in the event chain.
	 * @param {Boolean} [stopPropagation] Stop propagating this event in the
	 *		event chain.
	 * @example
	 * var element = CKeDITOR.document.getById( 'myElement' );
	 * element.on( 'click', function( ev )
	 *     {
	 *         // The DOM event object is passed by the "data" property.
	 *         var domEvent = ev.data;
	 *         // Prevent the click to chave any effect in the element.
	 *         domEvent.preventDefault();
	 *     });
	 */
	preventDefault : function( stopPropagation )
	{
		var $ = this.$;
		if ( $.preventDefault )
			$.preventDefault();
		else
			$.returnValue = false;

		if ( stopPropagation )
			this.stopPropagation();
	},

	stopPropagation : function()
	{
		var $ = this.$;
		if ( $.stopPropagation )
			$.stopPropagation();
		else
			$.cancelBubble = true;
	},

	/**
	 * Returns the DOM node where the event was targeted to.
	 * @returns {CKeDITOR.dom.node} The target DOM node.
	 * @example
	 * var element = CKeDITOR.document.getById( 'myElement' );
	 * element.on( 'click', function( ev )
	 *     {
	 *         // The DOM event object is passed by the "data" property.
	 *         var domEvent = ev.data;
	 *         // Add a CSS class to the event target.
	 *         domEvent.getTarget().addClass( 'clicKed' );
	 *     });
	 */

	getTarget : function()
	{
		var rawNode = this.$.target || this.$.srcElement;
		return rawNode ? new CKeDITOR.dom.node( rawNode ) : null;
	}
};

/**
 * CTRL Key (1000).
 * @constant
 * @example
 */
CKeDITOR.CTRL = 1000;

/**
 * SHIFT Key (2000).
 * @constant
 * @example
 */
CKeDITOR.SHIFT = 2000;

/**
 * ALT Key (4000).
 * @constant
 * @example
 */
CKeDITOR.ALT = 4000;
