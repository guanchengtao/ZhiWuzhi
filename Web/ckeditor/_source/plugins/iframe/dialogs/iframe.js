/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

(function()
{
	// Map 'true' and 'false' values to match W3C's specifications
	// http://www.w3.org/TR/REC-html40/present/frames.html#h-16.5
	var checkboxValues =
	{
		scrolling : { 'true' : 'yes', 'false' : 'no' },
		frameborder : { 'true' : '1', 'false' : '0' }
	};

	function loadValue( iframeNode )
	{
		var isCheckbox = this instanceof CKeDITOR.ui.dialog.checkbox;
		if ( iframeNode.hasAttribute( this.id ) )
		{
			var value = iframeNode.getAttribute( this.id );
			if ( isCheckbox )
				this.setValue( checkboxValues[ this.id ][ 'true' ] == value.toLowerCase() );
			else
				this.setValue( value );
		}
	}

	function commitValue( iframeNode )
	{
		var isRemove = this.getValue() === '',
			isCheckbox = this instanceof CKeDITOR.ui.dialog.checkbox,
			value = this.getValue();
		if ( isRemove )
			iframeNode.removeAttribute( this.att || this.id );
		else if ( isCheckbox )
			iframeNode.setAttribute( this.id, checkboxValues[ this.id ][ value ] );
		else
			iframeNode.setAttribute( this.att || this.id, value );
	}

	CKeDITOR.dialog.add( 'iframe', function( editor )
	{
		var iframeLang = editor.lang.iframe,
			commonLang = editor.lang.common,
			dialogadvtab = editor.plugins.dialogadvtab;
		return {
			title : iframeLang.title,
			minWidth : 350,
			minHeight : 260,
			onShow : function()
			{
				// Clear previously saved elements.
				this.faKeImage = this.iframeNode = null;

				var faKeImage = this.getSelectedElement();
				if ( faKeImage && faKeImage.data( 'cKe-real-element-type' ) && faKeImage.data( 'cKe-real-element-type' ) == 'iframe' )
				{
					this.faKeImage = faKeImage;

					var iframeNode = editor.restoreRealElement( faKeImage );
					this.iframeNode = iframeNode;

					this.setupContent( iframeNode, faKeImage );
				}
			},
			onOk : function()
			{
				var iframeNode;
				if ( !this.faKeImage )
					iframeNode = new CKeDITOR.dom.element( 'iframe' );
				else
					iframeNode = this.iframeNode;

				// A subset of the specified attributes/styles
				// should also be applied on the faKe element to
				// have better visual effect. (#5240)
				var extraStyles = {}, extraAttributes = {};
				this.commitContent( iframeNode, extraStyles, extraAttributes );

				// Refresh the faKe image.
				var newFaKeImage = editor.createFaKeElement( iframeNode, 'cKe_iframe', 'iframe', true );
				newFaKeImage.setAttributes( extraAttributes );
				newFaKeImage.setStyles( extraStyles );
				if ( this.faKeImage )
				{
					newFaKeImage.replace( this.faKeImage );
					editor.getSelection().selectElement( newFaKeImage );
				}
				else
					editor.insertElement( newFaKeImage );
			},
			contents : [
				{
					id : 'info',
					label : commonLang.generalTab,
					accessKey : 'I',
					elements :
					[
						{
							type : 'vbox',
							padding : 0,
							children :
							[
								{
									id : 'src',
									type : 'text',
									label : commonLang.url,
									required : true,
									validate : CKeDITOR.dialog.validate.notEmpty( iframeLang.noUrl ),
									setup : loadValue,
									commit : commitValue
								}
							]
						},
						{
							type : 'hbox',
							children :
							[
								{
									id : 'width',
									type : 'text',
									style : 'width:100%',
									labelLayout : 'vertical',
									label : commonLang.width,
									validate : CKeDITOR.dialog.validate.integer( commonLang.invalidWidth ),
									setup : function( iframeNode, faKeImage )
									{
										loadValue.apply( this, arguments );
										if ( faKeImage )
										{
											var faKeImageWidth = parseInt( faKeImage.$.style.width, 10 );
											if ( !isNaN( faKeImageWidth ) )
												this.setValue( faKeImageWidth );
										}
									},
									commit : function( iframeNode, extraStyles )
									{
										commitValue.apply( this, arguments );
										if ( this.getValue() )
											extraStyles.width = this.getValue() + 'px';
									}
								},
								{
									id : 'height',
									type : 'text',
									style : 'width:100%',
									labelLayout : 'vertical',
									label : commonLang.height,
									validate : CKeDITOR.dialog.validate.integer( commonLang.invalidHeight ),
									setup : function( iframeNode, faKeImage )
									{
										loadValue.apply( this, arguments );
										if ( faKeImage )
										{
											var faKeImageHeight = parseInt( faKeImage.$.style.height, 10 );
											if ( !isNaN( faKeImageHeight ) )
												this.setValue( faKeImageHeight );
										}
									},
									commit : function( iframeNode, extraStyles )
									{
										commitValue.apply( this, arguments );
										if ( this.getValue() )
											extraStyles.height = this.getValue() + 'px';
									}
								},
								{
									id : 'align',
									type : 'select',
									'default' : '',
									items :
									[
										[ commonLang.notSet , '' ],
										[ commonLang.alignLeft , 'left' ],
										[ commonLang.alignRight , 'right' ],
										[ commonLang.alignTop , 'top' ],
										[ commonLang.alignMiddle , 'middle' ],
										[ commonLang.alignBottom , 'bottom' ]
									],
									style : 'width:100%',
									labelLayout : 'vertical',
									label : commonLang.align,
									setup : function( iframeNode, faKeImage )
									{
										loadValue.apply( this, arguments );
										if ( faKeImage )
										{
											var faKeImageAlign = faKeImage.getAttribute( 'align' );
											this.setValue( faKeImageAlign && faKeImageAlign.toLowerCase() || '' );
										}
									},
									commit : function( iframeNode, extraStyles, extraAttributes )
									{
										commitValue.apply( this, arguments );
										if ( this.getValue() )
											extraAttributes.align = this.getValue();
									}
								}
							]
						},
						{
							type : 'hbox',
							widths : [ '50%', '50%' ],
							children :
							[
								{
									id : 'scrolling',
									type : 'checkbox',
									label : iframeLang.scrolling,
									setup : loadValue,
									commit : commitValue
								},
								{
									id : 'frameborder',
									type : 'checkbox',
									label : iframeLang.border,
									setup : loadValue,
									commit : commitValue
								}
							]
						},
						{
							type : 'hbox',
							widths : [ '50%', '50%' ],
							children :
							[
								{
									id : 'name',
									type : 'text',
									label : commonLang.name,
									setup : loadValue,
									commit : commitValue
								},
								{
									id : 'title',
									type : 'text',
									label : commonLang.advisoryTitle,
									setup : loadValue,
									commit : commitValue
								}
							]
						},
						{
							id : 'longdesc',
							type : 'text',
							label : commonLang.longDescr,
							setup : loadValue,
							commit : commitValue
						}
					]
				},
				dialogadvtab && dialogadvtab.createAdvancedTab( editor, { id:1, classes:1, styles:1 })
			]
		};
	});
})();
