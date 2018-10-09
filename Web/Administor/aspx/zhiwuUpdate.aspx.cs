using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class zhiwuUpdate : System.Web.UI.Page
    {
        BLL.ZhiWuXinXi ZhiWuXinXi = new BLL.ZhiWuXinXi();
        public Model.ZhiWuXinXi model { get; set; }
        public int MainKey { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
                int id = Int32.Parse(Request["id"]??"0");                
                model = ZhiWuXinXi.GetModel(id);
                this.plantsDetail.Text = model.FBQuYu;
                jingdu.Text = model.JingDu;
                weidu.Text = model.WeiDu;
                MainKey = id;
            }

        }

        protected void savebtn_Click(object sender, EventArgs e)
        {
            int id = Int32.Parse(Request["id"]?? "0");
            MainKey = id;
            var model = ZhiWuXinXi.GetModel(id);
            model.Xiaoqu= school.Items[school.SelectedIndex].Value; //获取Value 
            
            model.ZWXueMing = Request["zhiwuName"];
            model.JingDu = jingdu.Text;
            model.WeiDu = weidu.Text;
            model.YingWenMing = Request["zhiwueName"];
            model.FBQuYu =this.plantsDetail.Text;
            ZhiWuXinXi.Update(model);
            Context.Response.Redirect("ZhiwuList.aspx");
        }

        protected void calbtn_Click(object sender, EventArgs e)
        {
            Context.Response.Redirect("ZhiwuList.aspx");
        }
    }
}