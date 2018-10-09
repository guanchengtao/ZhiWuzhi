<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="SDAU.Web.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <link href="css/style.css" rel="stylesheet" />
    <link href="css/public.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div>

<!--头部-->
  <header class="publicHeader">
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
<section class="publicMian">
    <div class="left">
        <h2 class="leftH2"><span class="span1"></span>功能列表 <span></span></h2>
        <nav>
            <ul class="list">
                <li ><a href="billList.html">植物管理</a></li>
                <li><a href="providerList.html">图片管理</a></li>
                       <li><a href="#">用户评论</a></li>
                <li><a href="userList.html">用户管理</a></li>
                <li><a href="password.html">密码修改</a></li>
                <li><a href="login.html">退出系统</a></li>
            </ul>
        </nav>
    </div>
    <div class="right">
        <img class="wColck" src="../img/clock.jpg" />
        <div class="wFont">
            <h2>Admin</h2>
            <p>欢迎来到山东农业大学校园植物志管理系统!</p>
			<span id="hours"></span>
        </div>
    </div>
</section>


        </div>
    </form>
</body>
</html>
