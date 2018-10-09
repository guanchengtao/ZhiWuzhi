/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * A lightweight representation of an HTML comment.
 * @constructor
 * @example
 */
CKeDITOR.htmlParser.comment = function( value )
{
	/**
	 * The comment text.
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

CKeDITOR.htmlParser.comment.prototype =
{
	/**
	 * The node type. This is a constant value set to {@link CKeDITOR.NODE_COMMENT}.
	 * @type Number
	 * @example
	 */
	type : CKeDITOR.NODE_COMMENT,

	/**
	 * Writes the HTML representation of this comment to a CKeDITOR.htmlWriter.
	 * @param {CKeDITOR.htmlWriter} writer The writer to which write the HTML.
	 * @example
	 */
	writeHtml : function( writer, filter )
	{
		var comment = this.value;

		if ( filter )
		{
			if ( !( comment = filter.onComment( comment, this ) ) )
				return;

			if ( typeof comment != 'string' )
			{
				comment.parent = this.parent;
				comment.writeHtml( writer, filter );
				return;
			}
		}

		writer.comment( comment );
	}
};
