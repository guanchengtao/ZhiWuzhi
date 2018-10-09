using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class ZhiwuView : System.Web.UI.Page
    {
        public Model.ZhiWuXinXi list { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            int id = Int32.Parse(Request["id"]);
            BLL.ZhiWuXinXi zhiwu = new BLL.ZhiWuXinXi();
            list = zhiwu.GetModel(id);               
        }
        protected void calbtn_Click(object sender, EventArgs e)
        {
            Context.Response.Redirect("Zhiwulist.aspx");
        }
    }
}