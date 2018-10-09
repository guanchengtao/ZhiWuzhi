<%@ Page Language="C#" AutoEventWireup="true"
    CodeBehind="CKediter.aspx.cs"
    ValiDateRequest="false"
    Inherits="SDAU.Web.test.CKediter" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script src="../js/jquery-1.7.1.js"></script>
    <script src="../cKeditor/cKeditor.js"></script>
     <script src="../SWFupload/handlers.js"></script>
    <script src="../SWFupload/swfupload.js"></script>
    <script src="../js/jquery-1.7.1.js"></script>
    <script type="text/javascript">

        var swfu;
        $(function () {


            swfu = new SWFUpload({
                // BacKend Settings
                upload_url: "../Administor/ashx/upload.ashx?action=up",
                post_params: {
                    "ASPSESSID": "<%=Session.SessionID %>"
                },

                // File Upload Settings
                file_size_limit: "2 MB",
                file_types: "*.jpg",
                file_types_description: "JPG Images",
                file_upload_limit: 0,    // Zero means unlimited


                swfupload_preload_handler: preLoad,
                swfupload_load_failed_handler: loadFailed,
                file_queue_error_handler: fileQueueError,
                file_dialog_complete_handler: fileDialogComplete,
                upload_progress_handler: uploadProgress,
                upload_error_handler: uploadError,
                upload_success_handler: getUpImage,
                upload_complete_handler: uploadComplete,

                // Button settings
                button_image_url: "/SWFUpload/images/XPButtonNoText_160x22.png",
                button_placeholder_id: "spanButtonPlaceholder",
                button_width: 160,
                button_height: 22,
                button_text: '<span class="button">请选择上传图片<span class="buttonSmall">(2 MB Max)</span></span>',
                button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 14pt; } .buttonSmall { font-size: 10pt; }',
                button_text_top_padding: 1,
                button_text_left_padding: 5,

                // Flash Settings
                flash_url: "/SWFUpload/swfupload.swf", // Relative to this file
                flash9_url: "/SWFUpload/swfupload_FP9.swf", // Relative to this file

                custom_settings: {
                    upload_target: "divFileProgressContainer"
                },
                // Debug Settings
                debug: false
            });
        }); 
        function getUpImage(file, serverData) {
            var oEditor = CKeDITOR.instances.editor1;
            var d = serverData.split(':');
            if (oEditor.mode == 'wysiwyg') {
                var img = "<img src=.." + d[0] + " />";
                oEditor.insertHtml(img);
            }
            else
                alert('You must be in WYSIWYG mode!');

        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
     <textarea cols="100" id="editor1" name="editor1" rows="10"></textarea>

		<script type="text/javascript">

			var editor = CKeDITOR.replace( 'editor1' );

		</script>
        <input type="submit" name="name" value="提交" />
        <div id="content">

		
	    <div id="swfu_container" style="margin: 0px 10px;">
		    <div>
				<span id="spanButtonPlaceholder"></span>
		    </div>
		    <div id="divFileProgressContainer" style="height: 75px;"></div>
		    <div id="thumbnails"></div>
	
	    </div>
		</div>
    </form>
</body>
</html>
