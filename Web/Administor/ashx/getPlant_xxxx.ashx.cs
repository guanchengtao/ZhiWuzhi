using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace SDAU.Web.Administor.ashx
{
    /// <summary>
    /// getPlant_xxxx 的摘要说明
    /// </summary>
    public class getPlant_xxxx : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            int id =Int32.Parse(context.Request["id"]??"0");
            BLL.ZhiWuXinXi zhiWuXinXi = new BLL.ZhiWuXinXi();
            Model.ZhiWuXinXi model = new Model.ZhiWuXinXi();
            model = zhiWuXinXi.GetModel(id);
            var list = zhiWuXinXi.GetModel(id);
            list.FZFangFa = Common.UBB2Html.Decode(model.FZFangFa);
            list.SZXiXing = Common.UBB2Html.Decode(model.SZXiXing);
            list.XTTeZheng = Common.UBB2Html.Decode(model.XTTeZheng);
            list.ZYJiaZhi = Common.UBB2Html.Decode(model.ZYJiaZhi);
            list.SCHuanJing = Common.UBB2Html.Decode(model.SCHuanJing);
            list.ZPJiShu = Common.UBB2Html.Decode(model.ZPJiShu);
            list.FBQuYu = Common.UBB2Html.Decode(model.FBQuYu);
            var jsonstr = new JavaScriptSerializer().Serialize(list);
            context.Response.Write(jsonstr);
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