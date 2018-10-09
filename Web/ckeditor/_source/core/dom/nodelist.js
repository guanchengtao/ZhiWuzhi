/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

/**
 * @class
 */
CKeDITOR.dom.nodeList = function( nativeList )
{
	this.$ = nativeList;
};

CKeDITOR.dom.nodeList.prototype =
{
	count : function()
	{
		return this.$.length;
	},

	getItem : function( index )
	{
		var $node = this.$[ index ];
		return $node ? new CKeDITOR.dom.node( $node ) : null;
	}
};
