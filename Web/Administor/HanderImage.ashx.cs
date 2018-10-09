using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SDAU.Web.Administor
{
    /// <summary>
    /// HanderImage 的摘要说明
    /// </summary>
    public class HanderImage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string url = context.Request["url"];
            if (url.Length>50)
            {
                int id = Convert.ToInt32(context.Request["id"]);
                Model.ZhiWuTuPian img = new Model.ZhiWuTuPian();
                BLL.ZhiWuXinXi zhiWuXinXi = new BLL.ZhiWuXinXi();
                if (zhiWuXinXi.GetModel(id) != null)
                {
                    Model.ZhiWuXinXi zhiwumodel = zhiWuXinXi.GetModel(id);
                    zhiwumodel.Mu = url;
                    zhiWuXinXi.Update(zhiwumodel);
                }
                img.DiZhi = url;
                img.ZWBianHao = id;
                BLL.ZhiWuTuPian zhiWuTuPian = new BLL.ZhiWuTuPian();
                zhiWuTuPian.Add(img);
                context.Response.Write("上传成功！！！");
            }
            else
            {
                context.Response.Write("请选择图片！！！");
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