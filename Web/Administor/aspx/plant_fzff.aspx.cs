using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class plant_fzff : System.Web.UI.Page
    {

        BLL.ZhiWuXinXi ZhiWuXinXi = new BLL.ZhiWuXinXi();
        public Model.ZhiWuXinXi model { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                int id = Int32.Parse(Request["id"] ?? "0");
                model = ZhiWuXinXi.GetModel(id);
                this.fzff.Text = model.FZFangFa;
            }


        }

        protected void calbtn_Click(object sender, EventArgs e)
        {
            Context.Response.Redirect("Zhiwulist.aspx");

        }

        protected void savebtn_Click(object sender, EventArgs e)
        {
            int id = Int32.Parse(Request["id"] ?? "0");
            var model = ZhiWuXinXi.GetModel(id);
            model.FZFangFa = this.fzff.Text;
            ZhiWuXinXi.Update(model);
            Context.Response.Redirect("Zhiwulist.aspx");
        }
    }
}