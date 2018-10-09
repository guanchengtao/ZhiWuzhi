/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('template', function(K) {
	var self = this, name = 'template', lang = self.lang(name + '.'),
		htmlPath = self.pluginsPath + name + '/html/';
	function getFilePath(fileName) {
		return htmlPath + fileName + '?ver=' + encodeURIComponent(K.DEBUG ? K.TIME : K.VERSION);
	}
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			arr = ['<div class="Ke-plugin-template" style="padding:10px 20px;">',
				'<div class="Ke-header">',
				// left start
				'<div class="Ke-left">',
				lang. selectTemplate + ' <select>'];
			K.each(lang.fileList, function(Key, val) {
				arr.push('<option value="' + Key + '">' + val + '</option>');
			});
			html = [arr.join(''),
				'</select></div>',
				// right start
				'<div class="Ke-right">',
				'<input type="checkbox" id="KeReplaceFlag" name="replaceFlag" value="1" /> <label for="KeReplaceFlag">' + lang.replaceContent + '</label>',
				'</div>',
				'<div class="Ke-clearfix"></div>',
				'</div>',
				'<iframe class="Ke-textarea" frameborder="0" style="width:458px;height:260px;background-color:#FFF;"></iframe>',
				'</div>'].join('');
		var dialog = self.createDialog({
			name : name,
			width : 500,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var doc = K.iframeDoc(iframe);
					self[checkbox[0].checKed ? 'html' : 'insertHtml'](doc.body.innerHTML).hideDialog().focus();
				}
			}
		});
		var selectBox = K('select', dialog.div),
			checkbox = K('[name="replaceFlag"]', dialog.div),
			iframe = K('iframe', dialog.div);
		checkbox[0].checKed = true;
		iframe.attr('src', getFilePath(selectBox.val()));
		selectBox.change(function() {
			iframe.attr('src', getFilePath(this.value));
		});
	});
});
