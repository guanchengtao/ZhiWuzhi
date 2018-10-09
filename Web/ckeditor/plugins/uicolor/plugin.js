/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://cKeditor.com/license
*/

CKeDITOR.plugins.add('uicolor',{requires:['dialog'],lang:['en','he'],init:function(a){if(CKeDITOR.env.ie6Compat)return;a.addCommand('uicolor',new CKeDITOR.dialogCommand('uicolor'));a.ui.addButton('UIColor',{label:a.lang.uicolor.title,command:'uicolor',icon:this.path+'uicolor.gif'});CKeDITOR.dialog.add('uicolor',this.path+'dialogs/uicolor.js');CKeDITOR.scriptLoader.load(CKeDITOR.getUrl('plugins/uicolor/yui/yui.js'));a.element.getDocument().appendStyleSheet(CKeDITOR.getUrl('plugins/uicolor/yui/assets/yui.css'));}});
