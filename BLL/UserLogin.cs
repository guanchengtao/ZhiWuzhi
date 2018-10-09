using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SDAU.BLL
{
  public  class UserLogin
    {
       public  bool Userlogin( string userName, string userPassword, out string  msg, out Model.YongHuXinXi model)
        {
            DAL.YongHuXinXi yongHuXinXi = new DAL.YongHuXinXi();
            model = yongHuXinXi.GetModel(userName);
            if(model!=null)
            {
               if(model.YongHuMiMa==userPassword)
                {
                    msg = "登陆成功！!";
                    return true;
                }
                else
                {
                    msg = "密码错误！！";
                    return false;
                }
            }
            else
            {
                msg = "此用户不存在!";
                return false;
            }
        }
        public bool UserInfo(string name,string pwd)
        {
            DAL.YongHuXinXi yongHuXinXi = new DAL.YongHuXinXi();
            var   model = yongHuXinXi.GetModel(name);
            if (model.YongHuMiMa == pwd && model.YongHuMing == name) return true;
            else
            {
                return false;
            }
        }

    }
}
