using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
namespace SDAU.Web.Administor.aspx
{
    public partial class deleteImage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int tid = Convert.ToInt32( Request["tupianid"]);
            int pid= Convert.ToInt32(Request["zhiwuid"]);
            BLL.ZhiWuTuPian zhiWuTuPian = new BLL.ZhiWuTuPian();
            BLL.ZhiWuXinXi zhiWuXinXi = new BLL.ZhiWuXinXi();
            //先删除植物图片里的地址
            zhiWuTuPian.Delete(tid);
            //遍历植物图片里的图片地址，并把植物信息里的植物地址修改成遍历出来的第一个地址
            List<Model.ZhiWuTuPian> modellist = zhiWuTuPian.GetModelList(pid.ToString());
            Model.ZhiWuXinXi model = zhiWuXinXi.GetModel(pid);
            if (modellist != null)
            {
                //遍历删除之后剩下的地址，将第一个赋值
                foreach (var item in modellist)
                {
                    model.Mu = item.DiZhi;
                    break;
                }
            }
            else
            {
                model.Mu = null;
            }
            zhiWuXinXi.Update(model);
            Response.Redirect("addplantImage.aspx?id=" + pid);
        }
    }
}