/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	function createFaKeElement( editor, realElement )
	{
		var faKeElement = editor.createFaKeParserElement( realElement, 'cKe_iframe', 'iframe', true ),
			faKeStyle = faKeElement.attributes.style || '';

		var width = realElement.attributes.width,
			height = realElement.attributes.height;

		if ( typeof width != 'undefined' )
			faKeStyle += 'width:' + CKeDITOR.tools.cssLength( width ) + ';';

		if ( typeof height != 'undefined' )
			faKeStyle += 'height:' + CKeDITOR.tools.cssLength( height ) + ';';

		faKeElement.attributes.style = faKeStyle;

		return faKeElement;
	}

	CKeDITOR.plugins.add( 'iframe',
	{
		requires : [ 'dialog', 'faKeobjects' ],
		init : function( editor )
		{
			var pluginName = 'iframe',
				lang = editor.lang.iframe;

			CKeDITOR.dialog.add( pluginName, this.path + 'dialogs/iframe.js' );
			editor.addCommand( pluginName, new CKeDITOR.dialogCommand( pluginName ) );

			editor.addCss(
				'img.cKe_iframe' +
				'{' +
					'background-image: url(' + CKeDITOR.getUrl( this.path + 'images/placeholder.png' ) + ');' +
					'background-position: center center;' +
					'background-repeat: no-repeat;' +
					'border: 1px solid #a9a9a9;' +
					'width: 80px;' +
					'height: 80px;' +
				'}'
			);

			editor.ui.addButton( 'Iframe',
				{
					label : lang.toolbar,
					command : pluginName
				});

			editor.on( 'doubleclick', function( evt )
				{
					var element = evt.data.element;
					if ( element.is( 'img' ) && element.data( 'cKe-real-element-type' ) == 'iframe' )
						evt.data.dialog = 'iframe';
				});

			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
				{
					iframe :
					{
						label : lang.title,
						command : 'iframe',
						group : 'image'
					}
				});
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						if ( element && element.is( 'img' ) && element.data( 'cKe-real-element-type' ) == 'iframe' )
							return { iframe : CKeDITOR.TRISTATE_OFF };
					});
			}
		},
		afterInit : function( editor )
		{
			var dataProcessor = editor.dataProcessor,
				dataFilter = dataProcessor && dataProcessor.dataFilter;

			if ( dataFilter )
			{
				dataFilter.addRules(
				{
					elements :
					{
						iframe : function( element )
						{
							return createFaKeElement( editor, element );
						}
					}
				});
			}
		}
	});
})();
