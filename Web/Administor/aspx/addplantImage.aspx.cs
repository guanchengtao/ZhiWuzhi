using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class addplantImage : System.Web.UI.Page
    {
        public List<Model.ZhiWuTuPian> modellisttupian { get; set; }
        public Model.ZhiWuXinXi zhiwuxinxi { get; set; }
        public string zhiwuname { get; set; }
        public int zhiwubianhao { get; set; }
        public string dizhi { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                int id = Convert.ToInt32(Request["id"] ?? "1019");
                BLL.ZhiWuXinXi zhiWuXinXi = new BLL.ZhiWuXinXi();
                zhiwuxinxi = zhiWuXinXi.GetModel(id);
                zhiwuname = zhiwuxinxi.ZWXueMing.ToString();
                zhiwubianhao = id;
                BLL.ZhiWuTuPian zhiWuTuPian = new BLL.ZhiWuTuPian();
                modellisttupian = zhiWuTuPian.GetModelList(id.ToString());

            }
            else
            {

            }
        }
    }
}