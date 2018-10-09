<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="addPlants.aspx.cs" Inherits="SDAU.Web.Administor.aspx.addPlants" ValidateRequest="false" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>山东农业大学校园植物志管理系统</title>
        <link href="../../css/public.css" rel="stylesheet" />
    <link href="../../css/style.css" rel="stylesheet" />
    <script src="../../js/jquery-1.10.2.js"></script>
    <script src="../../js/time.js"></script>
    <script src="../../js/ubbeditor/ubbEditor.js"></script>
    <script src="../../js/timerr.js"></script>
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
            <span>植物管理页面 >> 植物添加页面</span>
        </div>
        <div class="providerAdd">
            <form id="form1" runat="server">
                <!--div的class 为error是验证错误，ok是验证成功-->
                <div class="">             
                </div>
                <div>
                    <label for="plantName">植物学名：</label>
                    <input type="text" name="plantName" id="plantName" />
                    <span>*必填</span>
                </div>
                    <div>
                    <label for="planteName">拉丁名：</label>
                    <input type="text" name="planteName" id="planteName" />

                </div>
                <div>
                  <label >校区：</label>
                    <select id="school" runat="server" >
                        <option value="">--请选择植物所在校区--</option>
                        <option value="北校区">北校区</option>
                        <option value="南校区">南校区</option>
                        <option value="东校区">东校区</option>
                    </select>      
                               <span>*必填</span>
                </div>
                <div>
                    <label for="location">位置：</label>
                    <input type="text" name="location" id="location"/>
                               <span>*必填</span>
                </div>    
                     <div>
                    <label for="location">经纬度：</label>
                         <input type="text" name="name" value="<%=Jingweidu %>" />     
                        
                             
                </div>          
                 <div>
                    <label for="plantsDetail">植物简介：</label>
                     <div style="margin-left:200px"> <asp:TextBox ID="plantsDetail" runat="server" TextMode="MultiLine" Height="200px" Width="500px"></asp:TextBox></div>
                    

                </div>


                <div class="providerAddBtn">
                    <asp:Button ID="btnadd" runat="server" Text="添加植物" OnClick="btnadd_Click" />
                    <asp:Button ID="btncancl" runat="server" Text="返回" OnClick="btncancl_Click" />
          
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
     <div style="width:100%;height:30px;background:linear-gradient(to bottom,#70b21c,#5c9613)   ">
           <span style="font-family:arial;font-size:medium;margin-left:580px">Copyright &copy;2018 山东农业大学智慧村镇重点实验室</span>
       </div>         
</body>
</html>