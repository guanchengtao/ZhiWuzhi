<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="addplantImage.aspx.cs" Inherits="SDAU.Web.Administor.aspx.addplantImage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
     <link rel="icon" href="../../Images/image/logo.ico" type="image/x-icon"/>
    <link href="../../css/public.css" rel="stylesheet" />
    <link href="../../css/style.css" rel="stylesheet" />
    <link href="../../css/NavPager.css" rel="stylesheet" />
    <script src="../../js/jquery-1.10.2.js"></script>
    <script src="../../js/jquery.js"></script>
    <script src="../../js/time.js"></script>
    <script src="../../js/js.js"></script>
    <script src="../../js/timerr.js"></script>
 <script type="text/javascript">
     $(function () {
         $("#cancal").click(function () {
             return confirm("您确认要退出系统吗？");
         })
     })
    </script>
     <style type="text/css">
        .name{
            font-size:x-large;
            color:black;
        }
    </style>
     <link href="../../css/imgareaselect-default.css" rel="stylesheet" />
    <script src="../../SWFupload/handlers.js"></script>
    <script src="../../SWFupload/swfupload.js"></script>
      <script type="text/javascript">
          $(function () {
              $(".delete").click(function () {
                  return confirm("你懂删除吗？");
              });
          });
            var swfu;
        $(function () {
            swfu = new SWFUpload({
                // BacKend Settings
                upload_url: "../ashx/upload.ashx?action=up",
                post_params: {
                    "ASPSESSID": "<%=Session.SessionID %>"
                },

                // File Upload Settings
                file_size_limit: "2 MB",
                file_types: "*.jpg",
                file_types_description: "Images",
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
                button_text: '<span class="button">请选择图片<span class="buttonSmall">(5 MB Max)</span></span>',
                button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 14pt; } .buttonSmall { font-size: 10pt; }',
                button_text_top_padding: 1,
                button_text_left_padding: 5,
                // Flash Settings
                flash_url: "../../SWFUpload/swfupload.swf", // Relative to this file
              flash9_url: "../../SWFUpload/swfupload_FP9.swf", // Relative to this file

                custom_settings: {
                    upload_target: "divFileProgressContainer"
                },

                // Debug Settings
                debug: false
            });

            });
          var imgurl;
            function getUpImage(file, serverData) {//上传成功以后执行该方法.

                $("#selectbanner").attr("src", serverData); //将上传成功的图片的路径赋值给了一个img标签
                //设置img标签的默认的选择的范围。
                imgurl = serverData;
            };                
         
            $(function () {
               
                $("#showbtn").click(function () {
                    var zhiwuid = $("#zhiwuid").text();
                    $.post("../HanderImage.ashx", { url: imgurl, id: zhiwuid }, function (data) {
                        alert(data);
                        if (data =="上传成功！！！")
                        location.reload();
                    })
                })
            });
            
                 
      </script>
</head>
<body>
    <form id="form1" runat="server">
        
            
                 <header class="publicHeader" style="padding-bottom:8px">
        <h1>山东农业大学校园植物志管理系统</h1>
 <div class="publicHeaderR">
        <p><span id="SHIJIAN"></span><span style="color: #fff21b"> Admin</span> , 欢迎你！</p>
        <a href="../../AdminLogin/Login/Login.html" id="cancal">退出</a> 
    </div>
    </header>
<!--时间-->
    <section class="publicTime">
        <span id="time">2015年1月1日 11:11  星期一</span>
        <a href="#">温馨提示：为了能正常浏览，请使用高版本浏览器！（IE10+）</a>
    </section>
<!--主体内容-->
    <section class="publicMian" style="height:auto ">
        <div class="left">
            <h2 class="leftH2"><span class="span1"></span>功能列表 <span></span></h2>
            <nav>
                <ul class="list">
   <li><a href="index.aspx">首页</a></li>
                   <li><a href="Zhiwulist.aspx">植物管理</a></li>
                    <li><a href="PlantsImgList.aspx">图片管理</a></li>
                    <li><a href="../GIS.aspx">植物分布</a></li>
                    <li><a href="usersComment.aspx">用户评论</a></li>
                    <li><a href="UsersList.aspx">账号管理</a></li>
                </ul>
            </nav>
        </div>
         <div class="right">
            <div class="location">
                <strong>你现在所在的位置是:</strong>
               <a href="Zhiwulist.aspx"> <span>图片管理页面>>添加植物图片</span></a>
            </div>
      
    <p class="name"><%=zhiwuname %></p>
    <p id="zhiwuid"><%=zhiwubianhao %></p>
	<div id="content">		
	    <div id="swfu_container" style="margin: 0px 10px;">
		    <div>
				<span id="spanButtonPlaceholder"></span>
		    </div>
		    <div id="divFileProgressContainer" style="height: 75px;"></div>
                                <input style="width:100px;height:50px;border-radius:10px;background-color:antiquewhite;color:blue" type="button" name="button" value="确定上传" id="showbtn" />   
		    <div id="thumbnails"></div>
             <img id="selectbanner" src="#"/>
	    </div>
    </div>

         <hr /><span style="font-size:large">已上传照片</span>
         <hr />
    <table>
       <%--<遍历显示上传之后所有的照片>--%>
       <%foreach (var item in modellisttupian)
           {%>
             <tr>
                 <td>
                     <img src="<%=item.DiZhi %>" alt="照片无法显示,要不就删除了吧？" /></td>
                 <td>
                     <img src="../../img/schu.png" /><a class="delete" href="deleteImage.aspx?tupianid=<%=item.TPBianHao %>&&zhiwuid=<%=item.ZWBianHao %>"><span style="font-size:15px">删除</span></a></td>
             </tr> 
           <%} %>
    </table>   </div>
        </section>
         <div style="width:100%;height:30px;background:linear-gradient(to bottom,#70b21c,#5c9613)   ">
           <span style="font-family:arial;font-size:medium;margin-left:580px">Copyright &copy;2018 山东农业大学智慧村镇重点实验室</span>
       </div>         
            </form>
</body>
</html>
