using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace SDAU.Web.Administor.ashx
{
    /// <summary>
    /// LoadPlant 的摘要说明
    /// </summary>
    public class LoadPlant : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
  
            context.Response.Write(DateTime.Now.ToLongDateString());

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