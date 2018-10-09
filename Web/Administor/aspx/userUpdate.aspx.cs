using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class userUpdate : System.Web.UI.Page
    {
        public string info { get; set; }
        BLL.YongHuXinXi yongHuXinXi = new BLL.YongHuXinXi();
        public Model.YongHuXinXi Model { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if(IsPostBack)
            {
                string yuanmima = Common.GetStringMd5.GetStringMD5( Request["yuanmima"]);
                string xinmima = Request["xinmima"];
                string querenmima = Request["querenmima"];

               Model = yongHuXinXi.GetModel(2175);
                if (Model.YongHuMiMa!=yuanmima)
                {
                    info = "<script>alert('原密码错误，请重新输入')</script>";
                    return;
                }
                else if (xinmima.Length < 2)
                {
                    info = "<script>alert('请输入新密码')</script>";
                    return;
                }
                else if(xinmima!=querenmima)
                {
                    info = "<script>alert('两次密码不一致，请重新输入')</script>";
                    return;
                }   
                else
                {
                    Model.YongHuMiMa =Common.GetStringMd5.GetStringMD5( xinmima);
                    Model.BeiZhu = xinmima;
                    yongHuXinXi.Update(Model);
                    info = "<script>alert('修改成功！')</script>";
                    string res = "success";
                    Context.Response.Redirect("UsersList.aspx?res="+res);
                }
            }
            else
            {
                Model = yongHuXinXi.GetModel(2175);
            }
        }
    }
}