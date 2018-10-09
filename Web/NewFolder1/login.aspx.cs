using System;
using System.Collections.Generic;

namespace SDAU.Web.NewFolder1
{
    public partial class Login : System.Web.UI.Page
    {
        public string Usersname { get; set; }
        public string Codestr { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if(IsPostBack)
            {
                #region 处理Cookies中的用户名

                string name = Request["txtClientID"];
                Response.Cookies["Key"].Value = Server.UrlEncode(name);
                Response.Cookies["Key"].Expires = DateTime.Now.AddDays(7);
                Usersname = name;
                #endregion
                #region 校验验证码
                string usercode = Request["txtCode"];
                string truecode = Session["ValidateCode"].ToString();
                if(usercode!=truecode)
                    {
                    Codestr = "<script>alert('验证码错误！')</script>";
                    return;
                }
                #endregion
                #region 校验用户名密码            
                string pwd =Common.GetStringMd5.GetStringMD5( Request["txtPassword"]);
                BLL.YongHuXinXi yongHuXinXi = new BLL.YongHuXinXi();
                string stringsql = string.Format(" YongHuMing='{0}' and YongHuMiMa='{1} '", Usersname, pwd);
                List<Model.YongHuXinXi> loginusers = yongHuXinXi.GetModelList(stringsql);
                if (loginusers.Count <= 0)
                {
                    Codestr = "<script>alert('账号或密码错误！')</script>";
                    return;
                }


                //if (name!="admin"&&pwd!="admin")
                //{
                //    Codestr = "<script>alert('账号或密码错误！')</script>";
                //        return;
                //}
                //把当前登录成功的用户放到Session里面
                //   Session["loginusers"] = loginusers[0];

                Session["loginusers"] = "admin";
                Response.Redirect("/Administor/aspx/index.aspx");
                #endregion
            }
            else
            {
                string namecookiesvalue = Request["Key"];
                Usersname =Server.UrlDecode(namecookiesvalue);
            }
        }
    }
}