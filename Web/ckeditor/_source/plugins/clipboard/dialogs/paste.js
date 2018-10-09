/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.dialog.add( 'paste', function( editor )
{
	var lang = editor.lang.clipboard;
	var isCustomDomain = CKeDITOR.env.isCustomDomain();

	function onPasteFrameLoad( win )
	{
		var doc = new CKeDITOR.dom.document( win.document ),
			docElement = doc.$;

		var script = doc.getById( 'cKe_actscrpt' );
		script && script.remove();

		CKeDITOR.env.ie ?
			docElement.body.contentEditable = "true" :
			docElement.designMode = "on";

		// IE before version 8 will leave cursor blinking inside the document after
		// editor blurred unless we clean up the selection. (#4716)
		if ( CKeDITOR.env.ie && CKeDITOR.env.version < 8 )
		{
			doc.getWindow().on( 'blur', function()
			{
				docElement.selection.empty();
			} );
		}

		doc.on( "Keydown", function( e )
		{
			var domEvent = e.data,
				Key = domEvent.getKeystroKe(),
				processed;

			switch( Key )
			{
				case 27 :
					this.hide();
					processed = 1;
					break;

				case 9 :
				case CKeDITOR.SHIFT + 9 :
					this.changeFocus( true );
					processed = 1;
			}

			processed && domEvent.preventDefault();
		}, this );

		editor.fire( 'ariaWidget', new CKeDITOR.dom.element( win.frameElement ) );
	}

	return {
		title : lang.title,

		minWidth : CKeDITOR.env.ie && CKeDITOR.env.quirks ? 370 : 350,
		minHeight : CKeDITOR.env.quirks ? 250 : 245,
		onShow : function()
		{
			// FIREFOX BUG: Force the browser to render the dialog to maKe the to-be-
			// inserted iframe editable. (#3366)
			this.parts.dialog.$.offsetHeight;

			this.setupContent();
		},

		onHide : function()
		{
			if ( CKeDITOR.env.ie )
				this.getParentEditor().document.getBody().$.contentEditable = 'true';
		},

		onLoad : function()
		{
			if ( ( CKeDITOR.env.ie7Compat || CKeDITOR.env.ie6Compat ) && editor.lang.dir == 'rtl' )
				this.parts.contents.setStyle( 'overflow', 'hidden' );
		},

		onOk : function()
		{
			this.commitContent();
		},

		contents : [
			{
				id : 'general',
				label : editor.lang.common.generalTab,
				elements : [
					{
						type : 'html',
						id : 'securityMsg',
						html : '<div style="white-space:normal;width:340px;">' + lang.securityMsg + '</div>'
					},
					{
						type : 'html',
						id : 'pasteMsg',
						html : '<div style="white-space:normal;width:340px;">'+lang.pasteMsg +'</div>'
					},
					{
						type : 'html',
						id : 'editing_area',
						style : 'width: 100%; height: 100%;',
						html : '',
						focus : function()
						{
							var win = this.getInputElement().$.contentWindow;

							// #3291 : JAWS needs the 500ms delay to detect that the editor iframe
							// iframe is no longer editable. So that it will put the focus into the
							// Paste from Word dialog's editable area instead.
							setTimeout( function()
							{
								win.focus();
							}, 500 );
						},
						setup : function()
						{
							var dialog = this.getDialog();
							var htmlToLoad =
								'<html dir="' + editor.config.contentsLangDirection + '"' +
								' lang="' + ( editor.config.contentsLanguage || editor.langCode ) + '">' +
								'<head><style>body { margin: 3px; height: 95%; } </style></head><body>' +
								'<script id="cKe_actscrpt" type="text/javascript">' +
								'window.parent.CKeDITOR.tools.callFunction( ' + CKeDITOR.tools.addFunction( onPasteFrameLoad, dialog ) + ', this );' +
								'</script></body>' +
								'</html>';

							var src =
								CKeDITOR.env.air ?
									'javascript:void(0)' :
								isCustomDomain ?
									'javascript:void((function(){' +
										'document.open();' +
										'document.domain=\'' + document.domain + '\';' +
										'document.close();' +
									'})())"'
								:
									'';

							var iframe = CKeDITOR.dom.element.createFromHtml(
								'<iframe' +
									' class="cKe_pasteframe"' +
									' frameborder="0" ' +
									' allowTransparency="true"' +
									' src="' + src + '"' +
									' role="region"' +
									' aria-label="' + lang.pasteArea + '"' +
									' aria-describedby="' + dialog.getContentElement( 'general', 'pasteMsg' ).domId + '"' +
									' aria-multiple="true"' +
									'></iframe>' );

							iframe.on( 'load', function( e )
							{
								e.removeListener();

								var doc = iframe.getFrameDocument();
								doc.write( htmlToLoad );

								if ( CKeDITOR.env.air )
									onPasteFrameLoad.call( this, doc.getWindow().$ );
							}, dialog );

							iframe.setCustomData( 'dialog', dialog );

							var container = this.getElement();
							container.setHtml( '' );
							container.append( iframe );

							// IE need a redirect on focus to maKe
							// the cursor blinking inside iframe. (#5461)
							if ( CKeDITOR.env.ie )
							{
								var focusGrabber = CKeDITOR.dom.element.createFromHtml( '<span tabindex="-1" style="position:absolute;" role="presentation"></span>' );
								focusGrabber.on( 'focus', function()
								{
									iframe.$.contentWindow.focus();
								});
								container.append( focusGrabber );

								// Override focus handler on field.
								this.focus = function()
								{
									focusGrabber.focus();
									this.fire( 'focus' );
								};
							}

							this.getInputElement = function(){ return iframe; };

							// Force container to scale in IE.
							if ( CKeDITOR.env.ie )
							{
								container.setStyle( 'display', 'block' );
								container.setStyle( 'height', ( iframe.$.offsetHeight + 2 ) + 'px' );
							}
						},
						commit : function( data )
						{
							var container = this.getElement(),
								editor = this.getDialog().getParentEditor(),
								body = this.getInputElement().getFrameDocument().getBody(),
								bogus = body.getBogus(),
								html;
							bogus && bogus.remove();

							// Saving the contents so changes until paste is complete will not taKe place (#7500)
							html = body.getHtml();

							setTimeout( function(){
								editor.fire( 'paste', { 'html' : html } );
							}, 0 );
						}
					}
				]
			}
		]
	};
});
