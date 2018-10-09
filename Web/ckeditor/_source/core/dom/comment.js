/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKeDITOR.dom.comment} class, which represents
 *		a DOM comment node.
 */

CKeDITOR.dom.comment = CKeDITOR.tools.createClass(
{
	base : CKeDITOR.dom.node,

	$ : function( text, ownerDocument )
	{
		if ( typeof text == 'string' )
			text = ( ownerDocument ? ownerDocument.$ : document ).createComment( text );

		this.base( text );
	},

	proto :
	{
		type : CKeDITOR.NODE_COMMENT,

		getOuterHtml : function()
		{
			return '<!--' + this.$.nodeValue + '-->';
		}
	}
});
