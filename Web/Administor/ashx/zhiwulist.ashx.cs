using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace SDAU.Web.Administor.ashx
{
    /// <summary>
    /// zhiwulist 的摘要说明
    /// </summary>
    public class zhiwulist : IHttpHandler
    {
        public int PageCount { get; set; }
        public string Navstring { get; set; }
        public List<Model.ZhiWuXinXi> list { get; set; }
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            int pageIndex = int.Parse(context.Request["pageIndex"] ?? "1");
            int pageSize =500;
            BLL.ZhiWuXinXi mainService = new BLL.ZhiWuXinXi();
            var ds = mainService.GetListByPage(string.Empty, " ", (pageIndex - 1) * pageSize + 1, pageSize * pageIndex);
            //取当前页的数据
            list = mainService.DataTableToList(ds.Tables[0]);
            foreach (var item in list)
            {
                item.FBQuYu = Common.UBB2Html.Decode(item.FBQuYu);
            }
            //设置一共多少页
            var allCount = mainService.GetRecordCount(string.Empty);
            PageCount = Math.Max((allCount + pageSize - 1) / pageSize, 1);
            //生成 分页的标签
            Navstring = Common.LaomaPager.ShowPageNavigate(pageSize, pageIndex, allCount);
            var jsonstr1 = new { list1 = list, Navstring1 = Navstring,count=allCount};
            string jsonstr = new JavaScriptSerializer().Serialize(jsonstr1);
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