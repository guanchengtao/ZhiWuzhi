using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SDAU.Common
{
  public class BaseCheckSesson:System.Web.UI.Page
    {
        protected override void OnInit(EventArgs e)
        {
            if(Session["userInfo"]==null)
            {
                WebCommon.GoPage();
            }
            base.OnInit(e);
        }
    }
}
