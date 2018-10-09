/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.dialog.add( 'about', function( editor )
{
	var lang = editor.lang.about;

	return {
		title : CKeDITOR.env.ie ? lang.dlgTitle : lang.title,
		minWidth : 390,
		minHeight : 230,
		contents : [
			{
				id : 'tab1',
				label : '',
				title : '',
				expand : true,
				padding : 0,
				elements :
				[
					{
						type : 'html',
						html :
							'<style type="text/css">' +
								'.cKe_about_container' +
								'{' +
									'color:#000 !important;' +
									'padding:10px 10px 0;' +
									'margin-top:5px' +
								'}' +
								'.cKe_about_container p' +
								'{' +
									'margin: 0 0 10px;' +
								'}' +
								'.cKe_about_container .cKe_about_logo' +
								'{' +
									'height:81px;' +
									'background-color:#fff;' +
									'background-image:url(' + CKeDITOR.plugins.get( 'about' ).path + 'dialogs/logo_cKeditor.png);' +
									'background-position:center; ' +
									'background-repeat:no-repeat;' +
									'margin-bottom:10px;' +
								'}' +
								'.cKe_about_container a' +
								'{' +
									'cursor:pointer !important;' +
									'color:blue !important;' +
									'text-decoration:underline !important;' +
								'}' +
							'</style>' +
							'<div class="cKe_about_container">' +
								'<div class="cKe_about_logo"></div>' +
								'<p>' +
									'CKeditor ' + CKeDITOR.version + ' (revision ' + CKeDITOR.revision + ')<br>' +
									'<a href="http://cKeditor.com/">http://cKeditor.com</a>' +
								'</p>' +
								'<p>' +
									lang.help.replace( '$1', '<a href="http://docs.cksource.com/CKeditor_3.x/Users_Guide/Quick_Reference">' + lang.userGuide + '</a>' ) +
								'</p>' +
								'<p>' +
									lang.moreInfo + '<br>' +
									'<a href="http://cKeditor.com/license">http://cKeditor.com/license</a>' +
								'</p>' +
								'<p>' +
									lang.copy.replace( '$1', '<a href="http://cksource.com/">CKSource</a> - Frederico Knabben' ) +
								'</p>' +
							'</div>'
					}
				]
			}
		],
		buttons : [ CKeDITOR.dialog.cancelButton ]
	};
} );
