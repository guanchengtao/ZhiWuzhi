<%@ Page Language="C#" 
    AutoEventWireup="true" 
    CodeBehind="zhiwuUpdate.aspx.cs" 
    validaterequest="false"
    Inherits="SDAU.Web.Administor.aspx.zhiwuUpdate" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>山东农业大学校园植物志管理系统</title>
      <link href="../../css/public.css" rel="stylesheet" />
    <link href="../../css/style.css" rel="stylesheet" />
    <link href="../../css/NavPager.css" rel="stylesheet" />
        <link href="../../css/style.css" rel="stylesheet" />
    <script src="../../js/jquery-1.10.2.js"></script>
    <script src="../../js/jquery.js"></script>
    <script src="../../js/js.js"></script>
    <script src="../../js/timerr.js"></script>
      <script src="../../js/ubbeditor/ubbEditor.js"></script>
     <script type="text/javascript">
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
          <a href="Zhiwulist.aspx"><span>植物管理页面</span></a>   >><a href="zhiwuUpdate.aspx?id=<%=model.ZWBianHao %>"><span> 植物编辑页面</span></a>
        </div>
        <div class="providerAdd">
    <form id="form1" runat="server">
                <div>
                    <label for="zhiwuName">植物学名：</label>
                    <input type="text" name="zhiwuName" id="zhiwuName" value="<%=model.ZWXueMing %>"/>
                    <span >*</span>
                </div>
                <div>
                    <label for="zhiwueName">英文名：</label>
                    <input type="text" name="zhiwueName" id="zhiwueName" value="<%=model.YingWenMing %>"/>
                    <span>*</span>
                </div>
                <div>
                 <label for="school">校区：</label>
                     <select id="school" runat="server" >
                        <option value="<%=model.Xiaoqu %>""></option>
                        <option value="北校区">北校区</option>
                        <option value="南校区">南校区</option>
                        <option value="东校区">东校区</option>
                    </select>      
                         <span>*</span>

                </div>
           
                               <label for="location">经纬度：</label>
                         <asp:TextBox ID="jingdu" runat="server" ></asp:TextBox>   <asp:TextBox ID="weidu" runat="server"></asp:TextBox>      
                                 

                <div>
                    <label for="plantsDetail">植物简介：</label>
                    <div id="nav" style="margin-left:220px">
                                 <a href="plant_szhj.aspx?id=<%=MainKey %>">生长环境</a>
                                 <a href="plant_xttz.aspx?id=<%=MainKey %>">形态特征</a>   
                                 <a href="plant_zpjs.aspx?id=<%=MainKey %>">栽培技术</a>
                                 <a href="plant_zyjz.aspx?id=<%=MainKey %>">主要价值</a>
                                 <a href="plant_fzff.aspx?id=<%=MainKey %>">繁殖方法</a>
                                 <a href="plant_szxx.aspx?id=<%=MainKey %>">生长习性</a>
                    </div>
                    <script>
                        $(function () {
                            $("#nav a").css("font-size", "17px").css("color", "#cccccc").mouseover(function () {
                                $(this).
                                    prevAll().css("font-size", "17px").css("color", "#cccccc")
                                    .end()
                                    .nextAll().css("font-size", "17px").css("color", "#cccccc")
                                    .end()
                                    .css("font-size", "17px")
                                    .css("color", "black")
                            });
                        });
                    </script>
                 <div style="margin-left:200px" >                     
                    <asp:TextBox ID="plantsDetail" runat="server" TextMode="MultiLine" Height="200px" Width="700px">
                    </asp:TextBox>
                                       
                    

                 </div>
                </div>
              
                <div class="providerAddBtn">               
                    <asp:Button ID="savebtn" runat="server" Text="保存" OnClick="savebtn_Click" />
                    <asp:Button ID="calbtn" runat="server" Text="返回" OnClick="calbtn_Click" />
                </div>
 
                  <script type="text/javascript">
            var nEditor = new ubbEditor('<%=this.plantsDetail.ClientID%>');
             nEditor.tLang = 'zh-cn';
            nEditor.tInit('nEditor', '../../js/ubbeditor/');
</script>

    </form>
            </div>
        </div>
</section>
  <div style="width:100%;height:60px;background:linear-gradient(to bottom,#70b21c,#5c9613)   ">
           <span style="font-family:arial;font-size:medium;margin-left:580px">Copyright &copy;2018 山东农业大学智慧村镇重点实验室</span>
       </div>         
</body>
</html>
