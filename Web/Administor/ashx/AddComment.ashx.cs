using SDAU.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SDAU.Web.Administor.ashx
{
    /// <summary>
    /// AddComment 的摘要说明
    /// </summary>
    public class AddComment : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string action = context.Request["action"];

            if (action == "add")
            {
                int id = Convert.ToInt32(context.Request["id"]);
                string msg = context.Request["msg"];
                string name = context.Request["name"];
                YongHuPingLun yongHuPingLun = new YongHuPingLun();
                Model.YongHuPingLun model = new Model.YongHuPingLun
                {
                    NeiRong = msg,
                    PLShiJian = DateTime.Now,
                    ZWBianHao = id,
                    BeiZhu = name,
                    YHBianHao = 2175
                };
                if (yongHuPingLun.Add(model) > 0)
                {
                    context.Response.Write("ok");
                }
            }
              else if(action=="load")
            {
                int id1 = Convert.ToInt32(context.Request["id1"]);
                YongHuPingLun yongHuPingLun = new YongHuPingLun();
                List<Model.YongHuPingLun> list = yongHuPingLun.GetModelList(id1.ToString());
                List<CommentViewModel> newlist = new List<CommentViewModel>();
            
                foreach (Model.YongHuPingLun model in list)
                {
                    CommentViewModel cmodel = new CommentViewModel
                    {
                        NeiRong = model.NeiRong
                    };
                    if (model.BeiZhu=="") { cmodel.Name = "匿名用户"; }
                    else
                    {
                        cmodel.Name = model.BeiZhu;
                    }
                    TimeSpan ts = DateTime.Now - model.PLShiJian;
                    cmodel.PLShiJian = Common.WebCommon.GetTimeSpan(ts);
                    newlist.Add(cmodel);
                }
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
                context.Response.Write(js.Serialize(newlist.ToArray()));
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