﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="userUpdate.aspx.cs" Inherits="SDAU.Web.Administor.aspx.userUpdate" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>山东农业大学校园植物志管理系统</title>
    <link href="../../css/public.css" rel="stylesheet" />
    <link href="../../css/style.css" rel="stylesheet" />
    <script src="../../js/jquery-1.10.2.js"></script>
    <script src="../../js/timerr.js"></script>
    <script type="text/javascript">
        $(function () {
            $("#forgetpwd").click(function () {
                alert($("#pwd").html());
            })
        })
         $(function () {
             $("#cancal").click(function () {
                 return confirm("您确认要退出系统吗？");
             })
         })
    </script>
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
                    <li><a href="Imagelist.aspx">图片管理</a></li>
                    <li><a href="../GIS.aspx">植物分布</a></li>
                    <li><a href="usersComment.aspx">用户评论</a></li>
                    <li><a href="UsersList.aspx">账号管理</a></li>
            </ul>
        </nav>
    </div>
    <div class="right">
        <div class="location">
            <strong>你现在所在的位置是:</strong>
            <span>用户管理页面 >> 修改密码</span>
        </div>
        <div class="providerAdd">
            <form action="#" id="form1" runat="server">
                          <div>
                    <label for="userpassword">原密码：</label>
                    <input type="password" name="yuanmima"  value=""/>
               &nbsp;   &nbsp;&nbsp;        <a href="#" id="forgetpwd">忘记密码？</a><p style="display:none" id="pwd"><%=Model.BeiZhu %></p>
                </div>
                <div>
                    <label for="userpassword">新密码：</label>
                    <input type="password" name="xinmima"  value=""/>
                    <span>*密码长度必须大于6位小于20位</span>
                  
                </div>
                <div>
                    <label for="userRemi">确认密码：</label>
                    <input type="password" name="querenmima"  value=""/>
                    <span></span>
                </div>                                   
                <div class="providerAddBtn">
                    <input type="submit" value="保存" />
                    <input type="button" value="返回" onclick="history.back(-1)"/>
                </div>
                <%=info %>
            </form>
        </div>

    </div>
</section>
     <div style="width:100%;height:30px;background:linear-gradient(to bottom,#70b21c,#5c9613)   ">
           <span style="font-family:arial;font-size:medium;margin-left:580px">Copyright &copy;2018 山东农业大学智慧村镇重点实验室</span>
       </div>         
    <script src="../../js/time.js"></script>
</body>
</html>