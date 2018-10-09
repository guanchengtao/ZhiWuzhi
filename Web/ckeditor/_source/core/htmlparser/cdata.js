/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{

	/**
	 * A lightweight representation of HTML text.
	 * @constructor
	 * @example
	 */
	CKeDITOR.htmlParser.cdata = function( value )
	{
		/**
		 * The CDATA value.
		 * @type String
		 * @example
		 */
		this.value = value;
	};

	CKeDITOR.htmlParser.cdata.prototype =
	{
		/**
		 * CDATA has the same type as {@link CKeDITOR.htmlParser.text} This is
		 * a constant value set to {@link CKeDITOR.NODE_TEXT}.
		 * @type Number
		 * @example
		 */
		type : CKeDITOR.NODE_TEXT,

		/**
		 * Writes write the CDATA with no special manipulations.
		 * @param {CKeDITOR.htmlWriter} writer The writer to which write the HTML.
		 */
		writeHtml : function( writer )
		{
			writer.write( this.value );
		}
	};
})();
