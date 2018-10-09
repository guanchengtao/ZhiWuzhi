using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace SDAU.Web.NewFolder1
{
    /// <summary>
    /// ValidateCodeHandler1 的摘要说明
    /// </summary>
    public class ValidateCodeHandler1 : IHttpHandler,IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            Common.LaomaPager.ShowPageNavigate(1, 1, 1);
            Common.ValidateCode validateCode = new Common.ValidateCode();
            string code=validateCode.CreateValidateCode(4);
            context.Session["vcode"] = code;
            validateCode.CreateValidateGraphic(code, context);

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}