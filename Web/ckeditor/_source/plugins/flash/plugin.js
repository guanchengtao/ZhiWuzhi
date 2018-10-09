/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	var flashFilenameRegex = /\.swf(?:$|\?)/i;

	var cssifyLength = CKeDITOR.tools.cssLength;

	function isFlashEmbed( element )
	{
		var attributes = element.attributes;

		return ( attributes.type == 'application/x-shockwave-flash' || flashFilenameRegex.test( attributes.src || '' ) );
	}

	function createFaKeElement( editor, realElement )
	{
		var faKeElement = editor.createFaKeParserElement( realElement, 'cKe_flash', 'flash', true ),
			faKeStyle = faKeElement.attributes.style || '';

		var width = realElement.attributes.width,
			height = realElement.attributes.height;

		if ( typeof width != 'undefined' )
			faKeStyle = faKeElement.attributes.style = faKeStyle + 'width:' + cssifyLength( width ) + ';';

		if ( typeof height != 'undefined' )
			faKeStyle = faKeElement.attributes.style = faKeStyle + 'height:' + cssifyLength( height ) + ';';

		return faKeElement;
	}

	CKeDITOR.plugins.add( 'flash',
	{
		init : function( editor )
		{
			editor.addCommand( 'flash', new CKeDITOR.dialogCommand( 'flash' ) );
			editor.ui.addButton( 'Flash',
				{
					label : editor.lang.common.flash,
					command : 'flash'
				});
			CKeDITOR.dialog.add( 'flash', this.path + 'dialogs/flash.js' );

			editor.addCss(
				'img.cKe_flash' +
				'{' +
					'background-image: url(' + CKeDITOR.getUrl( this.path + 'images/placeholder.png' ) + ');' +
					'background-position: center center;' +
					'background-repeat: no-repeat;' +
					'border: 1px solid #a9a9a9;' +
					'width: 80px;' +
					'height: 80px;' +
				'}'
				);

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
					{
						flash :
						{
							label : editor.lang.flash.properties,
							command : 'flash',
							group : 'flash'
						}
					});
			}

			editor.on( 'doubleclick', function( evt )
				{
					var element = evt.data.element;

					if ( element.is( 'img' ) && element.data( 'cKe-real-element-type' ) == 'flash' )
						evt.data.dialog = 'flash';
				});

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						if ( element && element.is( 'img' ) && !element.isReadOnly()
								&& element.data( 'cKe-real-element-type' ) == 'flash' )
							return { flash : CKeDITOR.TRISTATE_OFF };
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
							'cKe:object' : function( element )
							{
								var attributes = element.attributes,
									classId = attributes.classid && String( attributes.classid ).toLowerCase();

								if ( !classId && !isFlashEmbed( element ) )
								{
									// Look for the inner <embed>
									for ( var i = 0 ; i < element.children.length ; i++ )
									{
										if ( element.children[ i ].name == 'cKe:embed' )
										{
											if ( !isFlashEmbed( element.children[ i ] ) )
												return null;

											return createFaKeElement( editor, element );
										}
									}
									return null;
								}

								return createFaKeElement( editor, element );
							},

							'cKe:embed' : function( element )
							{
								if ( !isFlashEmbed( element ) )
									return null;

								return createFaKeElement( editor, element );
							}
						}
					},
					5);
			}
		},

		requires : [ 'faKeobjects' ]
	});
})();

CKeDITOR.tools.extend( CKeDITOR.config,
{
	/**
	 * Save as EMBED tag only. This tag is unrecommended.
	 * @type Boolean
	 * @default false
	 */
	flashEmbedTagOnly : false,

	/**
	 * Add EMBED tag as alternative: &lt;object&gt&lt;embed&gt&lt;/embed&gt&lt;/object&gt
	 * @type Boolean
	 * @default false
	 */
	flashAddEmbedTag : true,

	/**
	 * Use embedTagOnly and addEmbedTag values on edit.
	 * @type Boolean
	 * @default false
	 */
	flashConvertOnEdit : false
} );
