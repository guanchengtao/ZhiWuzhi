/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.dom.document} class, which
 *		represents a DOM document.
 */

/**
 * Represents a DOM window.
 * @constructor
 * @augments CKeDITOR.dom.domObject
 * @param {Object} domWindow A native DOM window.
 * @example
 * var document = new CKeDITOR.dom.window( window );
 */
CKeDITOR.dom.window = function( domWindow )
{
	CKeDITOR.dom.domObject.call( this, domWindow );
};

CKeDITOR.dom.window.prototype = new CKeDITOR.dom.domObject();

CKeDITOR.tools.extend( CKeDITOR.dom.window.prototype,
	/** @lends CKeDITOR.dom.window.prototype */
	{
		/**
		 * Moves the selection focus to this window.
		 * @function
		 * @example
		 * var win = new CKeDITOR.dom.window( window );
		 * <b>win.focus()</b>;
		 */
		focus : function()
		{
			// Webkit is sometimes failed to focus iframe, blur it first(#3835).
			if ( CKeDITOR.env.webkit && this.$.parent )
				this.$.parent.focus();
			this.$.focus();
		},

		/**
		 * Gets the width and height of this window's viewable area.
		 * @function
		 * @returns {Object} An object with the "width" and "height"
		 *		properties containing the size.
		 * @example
		 * var win = new CKeDITOR.dom.window( window );
		 * var size = <b>win.getViewPaneSize()</b>;
		 * alert( size.width );
		 * alert( size.height );
		 */
		getViewPaneSize : function()
		{
			var doc = this.$.document,
				stdMode = doc.compatMode == 'CSS1Compat';
			return {
				width : ( stdMode ? doc.documentElement.clientWidth : doc.body.clientWidth ) || 0,
				height : ( stdMode ? doc.documentElement.clientHeight : doc.body.clientHeight ) || 0
			};
		},

		/**
		 * Gets the current position of the window's scroll.
		 * @function
		 * @returns {Object} An object with the "x" and "y" properties
		 *		containing the scroll position.
		 * @example
		 * var win = new CKeDITOR.dom.window( window );
		 * var pos = <b>win.getScrollPosition()</b>;
		 * alert( pos.x );
		 * alert( pos.y );
		 */
		getScrollPosition : function()
		{
			var $ = this.$;

			if ( 'pageXOffset' in $ )
			{
				return {
					x : $.pageXOffset || 0,
					y : $.pageYOffset || 0
				};
			}
			else
			{
				var doc = $.document;
				return {
					x : doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
					y : doc.documentElement.scrollTop || doc.body.scrollTop || 0
				};
			}
		}
	});
