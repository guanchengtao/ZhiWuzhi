using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SDAU.Web.Administor.ashx
{
    /// <summary>
    /// upload 的摘要说明
    /// </summary>
    public class upload : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            HttpPostedFile file =context.Request.Files["Filedata"];
            string fileName = Path.GetFileName(file.FileName);
            string fileext = Path.GetExtension(fileName);

            if (fileext != " ")
            {
                string dir = "/UploadImage/InitialImage/" + DateTime.Now.Year + "/" + DateTime.Now.Month + "/" + DateTime.Now.Day + "/";
                Directory.CreateDirectory(Path.GetDirectoryName(context.Server.MapPath(dir)));
                string fulldir = dir + Common.GetStreamMD5.GetstreamMD5(file.InputStream) + fileext;
                file.SaveAs(context.Server.MapPath(fulldir));
                context.Response.Write(fulldir);
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