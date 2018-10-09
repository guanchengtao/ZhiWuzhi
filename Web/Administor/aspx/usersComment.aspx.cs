using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class usersComment : System.Web.UI.Page
    {
        public List<Model.ZhiWuXinXi> zhiwulist { get; set; }
        public int PageCount { get; set; }
        public string Navstring { get; set; }
        public int pageindex { set; get; }
        public int DataCount { get; set; }
        public string showinfo { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
                int pageIndex = int.Parse(Request["pageIndex"] ?? "1");
                int pageSize = 5;
                BLL.ZhiWuXinXi mainService = new BLL.ZhiWuXinXi();
                var ds = mainService.GetListByPage(string.Empty, " ", (pageIndex - 1) * pageSize + 1, pageSize * pageIndex);
                zhiwulist = mainService.DataTableToList(ds.Tables[0]);
                var allCount = mainService.GetRecordCount("");
            DataCount = allCount;
                PageCount = Math.Max((allCount + pageSize - 1) / pageSize, 1);
                Navstring = Common.LaomaPager.ShowPageNavigate(pageSize, pageIndex, allCount);
        }
        //搜索查询
        protected void Button1_Click(object sender, EventArgs e)
        {
            string plant = TextBox1.Text.ToString();
            int pageIndex = 1;
            pageindex = pageIndex;
            int allcount = 0;
            BLL.ZhiWuXinXi mainService = new BLL.ZhiWuXinXi();
            int pageSize = 0;
            if (plant.Length == 0)
            {
                pageSize = 5;
                var ds = mainService.GetListByPage(" ", " ", (pageIndex - 1) * pageSize + 1, pageSize * pageIndex);
                //取当前页的数据
                zhiwulist = mainService.DataTableToList(ds.Tables[0]);
                //设置一共多少页
                allcount = mainService.GetRecordCount(" ");
                DataCount = allcount;
                if (DataCount == 0) showinfo = "没有数据！";
                PageCount = Math.Max((allcount + pageSize - 1) / pageSize, 1);
                //   生成 分页的标签
                Navstring = Common.LaomaPager.ShowPageNavigate(pageSize, pageIndex, allcount);
            }
            else
            {
                pageSize = 1000;
                var ds = mainService.GetListByPage(plant, " ", (pageIndex - 1) * pageSize + 1, pageSize * pageIndex);
                //取当前页的数据
                zhiwulist = mainService.DataTableToList(ds.Tables[0]);
                //设置一共多少页
                var allCount = mainService.GetRecordCount(plant);
                DataCount = allCount;
                if (DataCount == 0) showinfo = "没有数据！";
                PageCount = 1;
                //生成 分页的标签
                Navstring = Common.LaomaPager.ShowPageNavigate(pageSize, pageIndex, allCount);

            }
        }
    }
}