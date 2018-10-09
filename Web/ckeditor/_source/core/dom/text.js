/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.dom.text} class, which represents
 *		a DOM text node.
 */

/**
 * Represents a DOM text node.
 * @constructor
 * @augments CKeDITOR.dom.node
 * @param {Object|String} text A native DOM text node or a string containing
 *		the text to use to create a new text node.
 * @param {CKeDITOR.dom.document} [ownerDocument] The document that will contain
 *		the node in case of new node creation. Defaults to the current document.
 * @example
 * var nativeNode = document.createTextNode( 'Example' );
 * var text = CKeDITOR.dom.text( nativeNode );
 * @example
 * var text = CKeDITOR.dom.text( 'Example' );
 */
CKeDITOR.dom.text = function( text, ownerDocument )
{
	if ( typeof text == 'string' )
		text = ( ownerDocument ? ownerDocument.$ : document ).createTextNode( text );

	// Theoretically, we should call the base constructor here
	// (not CKeDITOR.dom.node though). But, IE doesn't support expando
	// properties on text node, so the features provided by domObject will not
	// work for text nodes (which is not a big issue for us).
	//
	// CKeDITOR.dom.domObject.call( this, element );

	/**
	 * The native DOM text node represented by this class instance.
	 * @type Object
	 * @example
	 * var element = new CKeDITOR.dom.text( 'Example' );
	 * alert( element.$.nodeType );  // "3"
	 */
	this.$ = text;
};

CKeDITOR.dom.text.prototype = new CKeDITOR.dom.node();

CKeDITOR.tools.extend( CKeDITOR.dom.text.prototype,
	/** @lends CKeDITOR.dom.text.prototype */
	{
		/**
		 * The node type. This is a constant value set to
		 * {@link CKeDITOR.NODE_TEXT}.
		 * @type Number
		 * @example
		 */
		type : CKeDITOR.NODE_TEXT,

		getLength : function()
		{
			return this.$.nodeValue.length;
		},

		getText : function()
		{
			return this.$.nodeValue;
		},

		setText : function( text )
		{
			this.$.nodeValue = text;
		},

		/**
		 * Breaks this text node into two nodes at the specified offset,
		 * Keeping both in the tree as siblings. This node then only contains
		 * all the content up to the offset point. A new text node, which is
		 * inserted as the next sibling of this node, contains all the content
		 * at and after the offset point. When the offset is equal to the
		 * length of this node, the new node has no data.
		 * @param {Number} The position at which to split, starting from zero.
		 * @returns {CKeDITOR.dom.text} The new text node.
		 */
		split : function( offset )
		{
			// If the offset is after the last char, IE creates the text node
			// on split, but don't include it into the DOM. So, we have to do
			// that manually here.
			if ( CKeDITOR.env.ie && offset == this.getLength() )
			{
				var next = this.getDocument().createText( '' );
				next.insertAfter( this );
				return next;
			}

			var doc = this.getDocument();
			var retval = new CKeDITOR.dom.text( this.$.splitText( offset ), doc );

			// IE BUG: IE8 does not update the childNodes array in DOM after splitText(),
			// we need to maKe some DOM changes to maKe it update. (#3436)
			if ( CKeDITOR.env.ie8 )
			{
				var workaround = new CKeDITOR.dom.text( '', doc );
				workaround.insertAfter( retval );
				workaround.remove();
			}

			return retval;
		},

		/**
		 * Extracts characters from indexA up to but not including indexB.
		 * @param {Number} indexA An integer between 0 and one less than the
		 *		length of the text.
		 * @param {Number} [indexB] An integer between 0 and the length of the
		 *		string. If omitted, extracts characters to the end of the text.
		 */
		substring : function( indexA, indexB )
		{
			// We need the following check due to a Firefox bug
			// https://bugzilla.mozilla.org/show_bug.cgi?id=458886
			if ( typeof indexB != 'number' )
				return this.$.nodeValue.substr( indexA );
			else
				return this.$.nodeValue.substring( indexA, indexB );
		}
	});
