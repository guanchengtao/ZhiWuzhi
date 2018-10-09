using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SDAU.Web.NewFolder1
{
    public class BasePage: System.Web.UI.Page
    {
        public Model.YongHuXinXi  LoginUsers { get; set; }
        protected virtual void Page_Init(object sender, EventArgs e)
        {
            if (Session["loginusers"] == null)
            {
                Response.Redirect("/NewFolder1/login.aspx");
            }
            LoginUsers = Session["loginusers"] as Model.YongHuXinXi;
        }
    }
}