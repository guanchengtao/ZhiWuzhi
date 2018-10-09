using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace SDAU.Web.测试
{
    /// <summary>
    /// LoadPl 的摘要说明
    /// </summary>
    public class LoadPl : IHttpHandler
    {
     
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            int id = int.Parse(context.Request["id"]);          
            BLL.ZhiWuTuPian pic = new BLL.ZhiWuTuPian();
            var plantpic = pic.GetModel(id);
            var plantpic2 = pic.GetModelList(id.ToString());
            
            //浏览次数
            BLL.ZhiWuXinXi xinxi = new BLL.ZhiWuXinXi();
            if(plantpic==null)
            {
                string str = new JavaScriptSerializer().Serialize("error");
                context.Response.Write(str);
            }
            else
            {
                Model.ZhiWuXinXi model = xinxi.GetModel(plantpic.ZWBianHao);
                int ViewCount = int.Parse(model.BeiZhu);
                ViewCount = ViewCount + 1;
                model.BeiZhu = ViewCount.ToString();
                xinxi.Update(model);


                var plantintroduce = xinxi.GetModel(plantpic.ZWBianHao);
                plantintroduce.FBQuYu = Common.UBB2Html.Decode(plantintroduce.FBQuYu);
                plantintroduce.SZXiXing = Common.UBB2Html.Decode(plantintroduce.SZXiXing);
                plantintroduce.SCHuanJing = Common.UBB2Html.Decode(plantintroduce.SCHuanJing);
                plantintroduce.XTTeZheng = Common.UBB2Html.Decode(plantintroduce.XTTeZheng);
                plantintroduce.ZPJiShu = Common.UBB2Html.Decode(plantintroduce.ZPJiShu);
                plantintroduce.ZYJiaZhi = Common.UBB2Html.Decode(plantintroduce.ZYJiaZhi);
                plantintroduce.FZFangFa = Common.UBB2Html.Decode(plantintroduce.FZFangFa);
                var plant = new { pic = plantpic, itd = plantintroduce, pic2 = plantpic2 };
                string jsonstr = new JavaScriptSerializer().Serialize(plant);
                context.Response.Write(jsonstr);
            }
           
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}