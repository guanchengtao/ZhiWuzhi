/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	var htmlFilterRules =
	{
		elements :
		{
			$ : function( element )
			{
				var attributes = element.attributes,
					realHtml = attributes && attributes[ 'data-cKe-realelement' ],
					realFragment = realHtml && new CKeDITOR.htmlParser.fragment.fromHtml( decodeURIComponent( realHtml ) ),
					realElement = realFragment && realFragment.children[ 0 ];

				// If we have width/height in the element, we must move it into
				// the real element.
				if ( realElement && element.attributes[ 'data-cKe-resizable' ] )
				{
					var style = element.attributes.style;

					if ( style )
					{
						// Get the width from the style.
						var match = /(?:^|\s)width\s*:\s*(\d+)/i.exec( style ),
							width = match && match[1];

						// Get the height from the style.
						match = /(?:^|\s)height\s*:\s*(\d+)/i.exec( style );
						var height = match && match[1];

						if ( width )
							realElement.attributes.width = width;

						if ( height )
							realElement.attributes.height = height;
					}
				}

				return realElement;
			}
		}
	};

	CKeDITOR.plugins.add( 'faKeobjects',
	{
		requires : [ 'htmlwriter' ],

		afterInit : function( editor )
		{
			var dataProcessor = editor.dataProcessor,
				htmlFilter = dataProcessor && dataProcessor.htmlFilter;

			if ( htmlFilter )
				htmlFilter.addRules( htmlFilterRules );
		}
	});
})();

CKeDITOR.editor.prototype.createFaKeElement = function( realElement, className, realElementType, isResizable )
{
	var lang = this.lang.faKeobjects,
		label = lang[ realElementType ] || lang.unknown;

	var attributes =
	{
		'class' : className,
		src : CKeDITOR.getUrl( 'images/spacer.gif' ),
		'data-cKe-realelement' : encodeURIComponent( realElement.getOuterHtml() ),
		'data-cKe-real-node-type' : realElement.type,
		alt : label,
		title : label,
		align : realElement.getAttribute( 'align' ) || ''
	};

	if ( realElementType )
		attributes[ 'data-cKe-real-element-type' ] = realElementType;

	if ( isResizable )
		attributes[ 'data-cKe-resizable' ] = isResizable;

	return this.document.createElement( 'img', { attributes : attributes } );
};

CKeDITOR.editor.prototype.createFaKeParserElement = function( realElement, className, realElementType, isResizable )
{
	var lang = this.lang.faKeobjects,
		label = lang[ realElementType ] || lang.unknown,
		html;

	var writer = new CKeDITOR.htmlParser.basicWriter();
	realElement.writeHtml( writer );
	html = writer.getHtml();

	var attributes =
	{
		'class' : className,
		src : CKeDITOR.getUrl( 'images/spacer.gif' ),
		'data-cKe-realelement' : encodeURIComponent( html ),
		'data-cKe-real-node-type' : realElement.type,
		alt : label,
		title : label,
		align : realElement.attributes.align || ''
	};

	if ( realElementType )
		attributes[ 'data-cKe-real-element-type' ] = realElementType;

	if ( isResizable )
		attributes[ 'data-cKe-resizable' ] = isResizable;

	return new CKeDITOR.htmlParser.element( 'img', attributes );
};

CKeDITOR.editor.prototype.restoreRealElement = function( faKeElement )
{
	if ( faKeElement.data( 'cKe-real-node-type' ) != CKeDITOR.NODE_ELEMENT )
		return null;

	return CKeDITOR.dom.element.createFromHtml(
		decodeURIComponent( faKeElement.data( 'cKe-realelement' ) ),
		this.document );
};
