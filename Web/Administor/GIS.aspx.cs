using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor
{
    public partial class GIS : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }
        protected void Button1_Click(object sender, EventArgs e)
        {
            string jing= this.jingdu.Text.ToString();
            string wei = this.weidu.Text.ToString();
            if (jing.Length == 0) return;
            Context.Response.Redirect("aspx/addPlants.aspx?jingdu="+jing+"&&weidu="+wei);
        }
    }
}