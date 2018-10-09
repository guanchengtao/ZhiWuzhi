<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GIS.aspx.cs" Inherits="SDAU.Web.Administor.GIS" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	<style type="text/css">
	    body, html {
	        width: 100%;
	        height: 100%;
	        overflow: hidden;
	        margin: 0;
	        font-family: "微软雅黑";
	    }
    #allmap
    {
        height:80%;
        width:100%;

    }
    #title{
        font-size:40px;
        font-family:'Times New Roman', Times, serif;
        text-align:center;
        color:cadetblue;
        padding-top:10px;
        background-color:azure;
        height:65px;

    }
	</style>
    <script src="../js/jquery-1.10.2.js"></script>
    <script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=IFiIC3WAxhVibbv4QC7BueDep037yHyL"></script>
	<title>地图展示</title>
</head>
<body>   
    <div id="title">山东农业大学植物分布图</div>
    <div id="allmap"></div>
 <form id="form1" runat="server">
     经度：
     <asp:TextBox ID="jingdu" runat="server" ></asp:TextBox>
     纬度：
     <asp:TextBox ID="weidu" runat="server"></asp:TextBox>
     <asp:Button ID="Button1" runat="server" Text="标注植物" OnClick="Button1_Click" />
 </form>
</body>
</html>
<script type="text/javascript">
    // 百度地图API功能	
    map = new BMap.Map("allmap", { mapType: BMAP_SATELLITE_MAP });
    map.enableScrollWheelZoom(false);   //放大缩小
    //map.disableDragging();     //禁止拖拽
    //点击显示经纬度
    map.addEventListener("click", function (e) {
        var jingdu_value = e.point.lng;
        var weidu_value = e.point.lat;
        //alert(jingdu_value + "," + weidu_value);
        $("#jingdu").val(jingdu_value);
        $("#weidu").val(weidu_value);
    });


    //**********************************************************************************
    map.centerAndZoom(new BMap.Point(117.12406, 36.20067), 18);
    $.getJSON("ashx/zhiwulist.ashx", {}, function (data) {
        var gisdata = data.list1;
        $.each(gisdata, function (index, n) {
            gisdata[index].FBQuYu = gisdata[index].FBQuYu.substring(-1, 60) + "...<a href='aspx/ZhiwuView.aspx?id=" + gisdata[index].ZWBianHao + "'>查看详情</a>"; 
        })
        //经纬度
        var MapData;
      
        var data_info = [];
        var i = 0;
        console.log(data.count);
        console.log(gisdata.length);
        //数组存储每个植物的信息
        while (i < data.count) {
            data_info.unshift(
                [gisdata[i].JingDu, gisdata[i].WeiDu, "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>" + gisdata[i].ZWXueMing + "</h4>" +
                "<img style='float:right;margin:3px' id='imgDemo' src='" + gisdata[i].Mu + "' width='140' height='110' title=''/>" +
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + gisdata[i].FBQuYu + "</p>"]
            );
            i++;
        }                  
       var opts = {
           width: 350,
           height: 160,
           title: "", // 信息窗口标题
           enableMessage: true//设置允许信息窗发送短息
        };
        //自定义地图标注图片
       //var icon = new BMap.Icon('../img/TIM图片20180519091121.png', new BMap.Size(20, 32), {
       //    anchor: new BMap.Size(10, 30)
       //});
       //var marker = new BMap.Marker(new BMap.Point(116.498752, 39.900157), {
       //    icon: icon
       //});
       for (var i = 0; i < data_info.length; i++) {
           var marker = new BMap.Marker(new BMap.Point(data_info[i][0], data_info[i][1]));  // 创建标注
           var content = data_info[i][2];
           map.addOverlay(marker);
           marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
            // 将标注添加到地图中
           addClickHandler(content, marker);
       }
       function addClickHandler(content, marker) {
           marker.addEventListener("mouseover", function (e) {
               openInfo(content, e)
           }
           );
       }
       function openInfo(content, e) {
           var p = e.target;
           var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
           var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
           map.openInfoWindow(infoWindow, point); //开启信息窗口
       }



    });
   

</script>
