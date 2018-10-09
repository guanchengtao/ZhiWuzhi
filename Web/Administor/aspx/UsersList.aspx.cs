using SDAU.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class UsersList : Page
    {
        public Model.YongHuXinXi admin { get; set; }
        public string  res { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
                 res = Context.Request["res"]??"";
                if (res == "success") res = "修改成功!";
                admin = new BLL.YongHuXinXi().GetModel(2175);
            }
        }

        protected void Button1_Click(object sender, EventArgs e)
        {

        }
    }
    }
