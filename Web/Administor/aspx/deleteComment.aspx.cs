using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class deleteComment1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int id = Convert.ToInt32(Request["id"]);
            Model.YongHuPingLun model = new Model.YongHuPingLun();
            BLL.YongHuPingLun yongHuPingLun = new BLL.YongHuPingLun();

            model = yongHuPingLun.GetModel(id);
            int pid = model.ZWBianHao;
            yongHuPingLun.Delete(id);
   
            Response.Redirect("CommentView1.aspx?id="+pid);
        }
    }
}