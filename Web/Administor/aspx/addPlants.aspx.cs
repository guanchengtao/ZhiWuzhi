
using Maticsoft.Common;
using System;

namespace SDAU.Web.Administor.aspx
{
    public partial class addPlants : System.Web.UI.Page
    {
        BLL.ZhiWuXinXi zhiWuXinXi = new BLL.ZhiWuXinXi();
        Model.ZhiWuXinXi Plant = new Model.ZhiWuXinXi();
        public string Jingweidu { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
           if (Request["jingdu"]==null|| Request["weidu"]==null)
                {
                    Context.Response.Redirect("/Administor/GIS.aspx");
                }
                else
                {
                    Jingweidu = "(" + Request["jingdu"] + "," + Request["weidu"] + ")";
                }
            }

        }
        protected void btnadd_Click(object sender, EventArgs e)
        {
      
            Plant.ZWXueMing = Request["plantName"];
            Plant.YingWenMing = Request["planteName"];
            Plant.WeiZhi = Request["location"];
            Plant.Xiaoqu = school.Items[school.SelectedIndex].Value; //获取Value 
            Plant.FBQuYu =(Request["plantsDetail"]);
            Plant.JingDu = Request["jingdu"];
            Plant.WeiDu = Request["weidu"];
            Plant.ChanDi =" ";
            Plant.FZFangFa = " ";
            Plant.SCHuanJing = " ";
            Plant.ZPJiShu = " ";
            Plant.ZYJiaZhi = " ";
            Plant.SZXiXing = " ";
            Plant.XTTeZheng = " ";
            Plant.BeiZhu = 0.ToString();
            if (Plant.ZWXueMing=="" || Plant.WeiZhi==""|| Plant.Xiaoqu==""|| Request["plantsDetail"]=="")
            {
               MessageBox.Show(this,"植物信息不完整");
                return;
            }
            zhiWuXinXi.Add(Plant);
            Response.Redirect("Zhiwulist.aspx");
        }

        protected void btncancl_Click(object sender, EventArgs e)
        {
            Response.Redirect("Zhiwulist.aspx");
        }
    }
}