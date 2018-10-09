<%@ Page Language="C#" 
    AutoEventWireup="true"
    CodeBehind="login.aspx.cs"
    Inherits="SDAU.Web.NewFolder1.Login" %>

<!DOCTYPE html>
<html>
    <head>
   <meta http-equiv="Content-Type" content="text/html; charset=GBK"/>
       <title>
	网站管理后台登录
</title>
     <link href="../Images/style.css" rel="stylesheet" type="text/css"/>
    <style type="text/css">
    <!--
    body {
	    margin-top: 150px;
    }
    -->
    </style>
    <script type="text/javascript" src="../js/jquery-1.10.2.js"></script>
       <script type="text/javascript">
           $(function () {
               DoFresh();
               $("#imgValidateCode").click(function () {
                   DoFresh();
               });
               //DoFresh();
           })
           function DoFresh() {
               var img = $("#imgValidateCode");
               img.attr("src", "../test/VerifyCode.aspx?random=" + Math.random());

           } //添加的方法，src是生成图片的aspx的地址 
       </script>
</head>
<body>
    <form name="form1" method="post" runat="server" id="form1">

    <div>

    <table width="549" height="287" border="0" align="center" cellpadding="0" cellspacing="0" background="../Images/login_bg.jpg">
      <tbody><tr>
        <td width="23"><img src="../Images/login_leftbg.jpg" width="23" height="287"></td>
        <td width="503" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody><tr>
            <td width="49%" valign="bottom"><table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
              <tbody><tr>
                <td height="100" valign="top" class="login_text"><div align="left">
                    网站后台管理系统</div></td>
              </tr>
              <tr>
        
                <td><div align="right"><img src="../Images/login_img.jpg" width="104" height="113"></div></td>
              </tr>
            </tbody></table></td>
            <td width="2%"><img src="../Images/login_line.jpg" width="6" height="287"></td>
            <td width="49%"><div align="right">
              <table width="223" border="0" cellspacing="0" cellpadding="0">
                <tbody><tr>
                  <td><img src="../Images/login_tit.jpg" width="223" height="30"></td>
                </tr>
                <tr>
                  <td><table width="100%" border="0" cellspacing="10" cellpadding="0">
                    <tbody><tr>
                      <td width="28%"><div align="left">用户名：</div></td>
                      <td width="72%"><div align="left"><span class="style1">
                          <input name="txtClientID" type="text" id="txtClientID" class="form2" style="height:15px;width:140px;" value="<%=Usersname %>">
                      </span></div></td>
                    </tr>
                    <tr>
                      <td><div align="left">密&nbsp;&nbsp;码：</div></td>
                      <td><div align="left"><span class="style1">
                          <input name="txtPassword" type="password" id="txtPassword" class="form2" style="height:15px;width:140px;"></span></div></td>
                    </tr>
                    <tr>
                      <td><div align="left">验证码：</div></td>
                      <td>
                          <input name="txtCode" type="text" size="8" id="txtCode" class="form2" style="height:15px;"/> 
                          <img src="" alt="点击刷新" id="imgValidateCode" style="width: 60px; height: 25px; line-height: 30px; vertical-align: middle;" />  
                             </td>
                    </tr>
                  </tbody></table></td>
                </tr>
                <tr>
                  <td align="center"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody><tr>
                      <td><div align="center"></div></td>
                      <td><div align="center">
                          <input type="image" name="btnLogin" id="btnLogin" src="../Images/login_menu2.jpg" style="border-width:0px;"></div></td>
                    </tr>
                  </tbody></table>
                      <strong><span style="color: #3180b7">辽ICP备10012593号</span></strong></td>
                </tr>
              </tbody></table>
            </div></td>
          </tr>
        </tbody></table></td>
        <td width="23"><img src="../Images/login_rigbg.jpg" width="23" height="287"></td>
      </tr>
    </tbody></table>
    </div>
    </form>

    <%=Codestr %>
</body></html>