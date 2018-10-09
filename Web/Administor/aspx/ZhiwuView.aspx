<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ZhiwuView.aspx.cs" Inherits="SDAU.Web.Administor.aspx.ZhiwuView" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
   <title>山东农业大学校园植物志管理系统</title>
<link href="../../css/public.css" rel="stylesheet" />
    <link href="../../css/style.css" rel="stylesheet" />
    <link href="../../css/NavPager.css" rel="stylesheet" />
        <link href="../../css/style.css" rel="stylesheet" />
    <script src="../../js/jquery-1.7.1.js"></script>
    <script src="../../js/jquery.js"></script>
    <script src="../../js/js.js"></script>
    <script src="../../js/time.js"></script>
    <script src="../../js/timerr.js"></script>
    <script>
        $(function () {        
            var pid = window.location.href.split("=")[1];
            $.getJSON("../ashx/getPlant_xxxx.ashx", { id: pid }, function (data) {
                 $("#asp").html(data.FBQuYu);
                 plantIntroduce(data);
            });
            function plantIntroduce(data) {
                $("#jbxx").click(function () {
                    $("#asp").html(data.FBQuYu);
                });          
                $("#szhj").click(function () {
                    $("#asp").html(data.SCHuanJing);
                });
                $("#xttz").click(function () {
                    $("#asp").html(data.XTTeZheng);
                });
                $("#zpjs").click(function () {
                    $("#asp").html(data.ZPJiShu);
                });
                $("#zyjz").click(function () {
                    $("#asp").html(data.ZYJiaZhi);
                });
                $("#fzff").click(function () {
                    $("#asp").html(data.FZFangFa);
                });
                $("#szxx").click(function () {
                    $("#asp").html(data.SZXiXing);
                });
            };  
        });
    </script>
     <script type="text/javascript">
         $(function () {
             $("#cancal").click(function () {
                 return confirm("您确认要退出系统吗？");
             })
         })
    </script>
    <style>
        #calbtn{
            margin-left:200px;
        }
    </style>
</head>
<body>
<!--头部-->
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
<section class="publicMian " style="height:600px">
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
            <span>植物管理页面 >> 植物信息查看</span>
        </div>

        <form id="form1" runat="server">
        <div class="providerView">
            <p><strong>植物编号：</strong><span><%=list.ZWBianHao %></span></p>
            <p><strong>植物学名：</strong><span><%=list.ZWXueMing %></span></p>
            <p><strong>校区：</strong><span><%=list.Xiaoqu %></span></p>
            <p><strong>位置：</strong><span><%=list.WeiZhi %></span></p>
          
                <strong>植物简介：</strong><br/>
         <div style="margin-left:200px;"> 
             <input id="jbxx" type="button" value="基本信息" />
            <input id="zyjz" type="button" value="主要价值" />
            <input id="xttz" type="button" value="形态特征" />       
            <input id="fzff" type="button" value="繁殖方法" />
            <input id="szxx" type="button" value="生长习性" />
            <input id="szhj" type="button" value="生长环境" />
            <input id="zpjs" type="button" value="栽培技术" /></div>  
                <div id="asp" style="width:800px;height:280px;border:1px solid red;margin-left:200px">             
               </div>               
        <asp:Button ID="calbtn" runat="server" Width="100px" Text="返回" OnClick="calbtn_Click" />
        </div>

            </form>

        </div>
</section>
     <div style="width:100%;height:30px;background:linear-gradient(to bottom,#70b21c,#5c9613)   ">
           <span style="font-family:arial;font-size:medium;margin-left:580px">Copyright &copy;2018 山东农业大学智慧村镇重点实验室</span>
       </div>         
</body>
</html>