/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	var spacesRegex = /[\t\r\n ]{2,}|[\t\r\n]/g;

	/**
	 * A lightweight representation of HTML text.
	 * @constructor
	 * @example
	 */
 	CKeDITOR.htmlParser.text = function( value )
	{
		/**
		 * The text value.
		 * @type String
		 * @example
		 */
		this.value = value;

		/** @private */
		this._ =
		{
			isBlockLiKe : false
		};
	};

	CKeDITOR.htmlParser.text.prototype =
	{
		/**
		 * The node type. This is a constant value set to {@link CKeDITOR.NODE_TEXT}.
		 * @type Number
		 * @example
		 */
		type : CKeDITOR.NODE_TEXT,

		/**
		 * Writes the HTML representation of this text to a CKeDITOR.htmlWriter.
		 * @param {CKeDITOR.htmlWriter} writer The writer to which write the HTML.
		 * @example
		 */
		writeHtml : function( writer, filter )
		{
			var text = this.value;

			if ( filter && !( text = filter.onText( text, this ) ) )
				return;

			writer.text( text );
		}
	};
})();
