/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('image', function(K) {
	var self = this, name = 'image',
		allowImageUpload = K.undef(self.allowImageUpload, true),
		allowFileManager = K.undef(self.allowFileManager, false),
		uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php'),
		imgPath = self.basePath + 'plugins/image/images/',
		lang = self.lang(name + '.');

	self.plugin.imageDialog = function(options) {
		var imageUrl = K.undef(options.imageUrl, 'http://'),
			imageWidth = K.undef(options.imageWidth, ''),
			imageHeight = K.undef(options.imageHeight, ''),
			imageTitle = K.undef(options.imageTitle, ''),
			imageAlign = K.undef(options.imageAlign, ''),
			clickFn = options.clickFn;
		var html = [
			'<div style="padding:10px 20px;">',
			//tabs
			'<div class="tabs"></div>',
			//url or file
			'<div class="Ke-dialog-row">',
			'<div class="tab1" style="display:none;">',
			'<label for="KeUrl" style="width:60px;">' + lang.remoteUrl + '</label>',
			'<input type="text" id="KeUrl" class="Ke-input-text" name="url" value="" style="width:200px;" /> &nbsp;',
			'<span class="Ke-button-common Ke-button-outer">',
			'<input type="button" class="Ke-button-common Ke-button" name="viewServer" value="' + lang.viewServer + '" />',
			'</span>',
			'</div>',
			'<div class="tab2" style="display:none;">',
			'<label style="width:60px;">' + lang.localUrl + '</label>',
			'<input type="text" name="localUrl" class="Ke-input-text" tabindex="-1" style="width:200px;" readonly="true" /> &nbsp;',
			'<input type="button" class="Ke-upload-button" value="' + lang.viewServer + '" />',
			'</div>',
			'</div>',
			//size
			'<div class="Ke-dialog-row">',
			'<label for="KeWidth" style="width:60px;">' + lang.size + '</label>',
			lang.width + ' <input type="text" id="KeWidth" class="Ke-input-text Ke-input-number" name="width" value="" maxlength="4" /> ',
			lang.height + ' <input type="text" class="Ke-input-text Ke-input-number" name="height" value="" maxlength="4" /> ',
			'<img class="Ke-refresh-btn" src="' + imgPath + 'refresh.gif" width="16" height="16" alt="" style="cursor:pointer;" />',
			'</div>',
			//align
			'<div class="Ke-dialog-row">',
			'<label style="width:60px;">' + lang.align + '</label>',
			'<input type="radio" name="align" class="Ke-inline-block" value="" checKed="checKed" /> <img name="defaultImg" src="' + imgPath + 'align_top.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="Ke-inline-block" value="left" /> <img name="leftImg" src="' + imgPath + 'align_left.gif" width="23" height="25" alt="" />',
			' <input type="radio" name="align" class="Ke-inline-block" value="right" /> <img name="rightImg" src="' + imgPath + 'align_right.gif" width="23" height="25" alt="" />',
			'</div>',
			//title
			'<div class="Ke-dialog-row">',
			'<label for="KeTitle" style="width:60px;">' + lang.imgTitle + '</label>',
			'<input type="text" id="KeTitle" class="Ke-input-text" name="title" value="" style="width:200px;" /></div>',
			'</div>',
			'</div>'
		].join('');
		var dialogWidth = allowImageUpload ? 450 : 400;
			dialogHeight = allowImageUpload ? 300 : 250;
		var dialog = self.createDialog({
			name : name,
			width : dialogWidth,
			height : dialogHeight,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					// insert local image
					if (tabs && tabs.selectedIndex === 1) {
						dialog.showLoading(self.lang('uploadLoading'));
						uploadbutton.submit();
						localUrlBox.val('');
						return;
					}
					// insert remote image
					var url = K.trim(urlBox.val()),
						width = widthBox.val(),
						height = heightBox.val(),
						title = titleBox.val(),
						align = '';
					alignBox.each(function() {
						if (this.checKed) {
							align = this.value;
							return false;
						}
					});
					if (url == 'http://' || K.invalidUrl(url)) {
						alert(self.lang('invalidUrl'));
						urlBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(width)) {
						alert(self.lang('invalidWidth'));
						widthBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(height)) {
						alert(self.lang('invalidHeight'));
						heightBox[0].focus();
						return;
					}
					clickFn.call(self, url, title, width, height, 0, align);
				}
			},
			beforeRemove : function() {
				viewServerBtn.remove();
				widthBox.remove();
				heightBox.remove();
				refreshBtn.remove();
				uploadbutton.remove();
			}
		}),
		div = dialog.div;

		var tabs;
		if (allowImageUpload) {
			tabs = K.tabs({
				src : K('.tabs', div),
				afterSelect : function(i) {
			
				}
			});
			tabs.add({
				title : lang.remoteImage,
				panel : K('.tab1', div)
			});
			tabs.add({
				title : lang.localImage,
				panel : K('.tab2', div)
			});
			tabs.select(0);
		} else {
			K('.tab1', div).show();
		}

		var urlBox = K('[name="url"]', div),
			localUrlBox = K('[name="localUrl"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			widthBox = K('[name="width"]', div),
			heightBox = K('[name="height"]', div),
			refreshBtn = K('.Ke-refresh-btn', div),
			titleBox = K('[name="title"]', div),
			alignBox = K('[name="align"]');

		var uploadbutton = K.uploadbutton({
			button : K('.Ke-upload-button', div)[0],
			fieldName : 'imgFile',
			url : K.addParam(uploadJson, 'dir=image'),
			afterUpload : function(data) {
				dialog.hideLoading();
				if (data.error === 0) {
					var width = widthBox.val(),
						height = heightBox.val(),
						title = titleBox.val(),
						align = '';
					alignBox.each(function() {
						if (this.checKed) {
							align = this.value;
							return false;
						}
					});
					var url = K.formatUrl(data.url, 'absolute');
					clickFn.call(self, url, title, width, height, 0, align);
					if (self.afterUpload) {
						self.afterUpload.call(self, url);
					}
				} else {
					alert(data.message);
				}
			},
			afterError : function(html) {
				dialog.hideLoading();
				self.errorDialog(html);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			localUrlBox.val(uploadbutton.fileBox.val());
		});
		if (allowFileManager) {
			viewServerBtn.click(function(e) {
				self.loadPlugin('filemanager', function() {
					self.plugin.filemanagerDialog({
						viewType : 'VIEW',
						dirName : 'image',
						clickFn : function(url, title) {
							if (self.dialogs.length > 1) {
								K('[name="url"]', div).val(url);
								self.hideDialog();
							}
						}
					});
				});
			});
		} else {
			viewServerBtn.hide();
		}
		var originalWidth = 0, originalHeight = 0;
		function setSize(width, height) {
			widthBox.val(width);
			heightBox.val(height);
			originalWidth = width;
			originalHeight = height;
		}
		refreshBtn.click(function(e) {
			var tempImg = K('<img src="' + urlBox.val() + '" />', document).css({
					position : 'absolute',
					visibility : 'hidden',
					top : 0,
					left : '-1000px'
				});
			K(document.body).append(tempImg);
			setSize(tempImg.width(), tempImg.height());
			tempImg.remove();
		});
		widthBox.change(function(e) {
			if (originalWidth > 0) {
				heightBox.val(Math.round(originalHeight / originalWidth * parseInt(this.value, 10)));
			}
		});
		heightBox.change(function(e) {
			if (originalHeight > 0) {
				widthBox.val(Math.round(originalWidth / originalHeight * parseInt(this.value, 10)));
			}
		});
		urlBox.val(options.imageUrl);
		setSize(options.imageWidth, options.imageHeight);
		titleBox.val(options.imageTitle);
		alignBox.each(function() {
			if (this.value === options.imageAlign) {
				this.checKed = true;
				return false;
			}
		});
		urlBox[0].focus();
		urlBox[0].select();
		return dialog;
	};
	self.plugin.image = {
		edit : function() {
			var img = self.plugin.getSelectedImage();
			self.plugin.imageDialog({
				imageUrl : img ? img.attr('data-Ke-src') : 'http://',
				imageWidth : img ? img.width() : '',
				imageHeight : img ? img.height() : '',
				imageTitle : img ? img.attr('title') : '',
				imageAlign : img ? img.attr('align') : '',
				clickFn : function(url, title, width, height, border, align) {
					self.exec('insertimage', url, title, width, height, border, align);
					// Bugfix: [Firefox] 上传图片后，总是出现正在加载的样式，需要延迟执行hideDialog
					setTimeout(function() {
						self.hideDialog().focus();
					}, 0);
				}
			});
		},
		'delete' : function() {
			self.plugin.getSelectedImage().remove();
		}
	};
	self.clickToolbar(name, self.plugin.image.edit);
});
