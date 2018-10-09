using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDAU.Web.Administor.aspx
{
    public partial class CommentView1 : System.Web.UI.Page
    {

        public Model.ZhiWuXinXi zhiwuxinxi { get; set; }
        public List<Model.YongHuPingLun> list { get; set; }
        public string showinfo { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if(!IsPostBack)
            {
                int id = Convert.ToInt32(Request["id"]);
                BLL.ZhiWuXinXi zhiWuXinXi = new BLL.ZhiWuXinXi();
                zhiwuxinxi = zhiWuXinXi.GetModel(id);
                ////根据植物编号寻找与他相关的所有的评论
                list = new BLL.YongHuPingLun().GetModelList(id.ToString());
               
                foreach (var item in list)
                {
                    if (item.BeiZhu == "") item.BeiZhu = "匿名用户";
                    if(item.NeiRong.Length>40)
                    item.NeiRong = item.NeiRong.Substring(0, 40);
                }
            }
        }
    }
}