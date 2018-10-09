using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class zhiwuDelete : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        { 
            int id = int.Parse(Request["id"] ?? "0");
            //删除植物之前，先删除植物所关联的图片以及用户对此植物的评论
            BLL.ZhiWuXinXi zhiWuXinXi = new BLL.ZhiWuXinXi();
            BLL.ZhiWuTuPian zhiWuTuPian = new BLL.ZhiWuTuPian();
            BLL.YongHuPingLun yongHuPingLun = new BLL.YongHuPingLun();
            
            zhiWuTuPian.DeleteByZhiwuId(id);
            yongHuPingLun.DeleteByZhiwuId(id);
            zhiWuXinXi.Delete(id);
            Response.Redirect("Zhiwulist.aspx");
        }
    }
}