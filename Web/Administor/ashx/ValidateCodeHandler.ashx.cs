using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace SDAU.Web.Administor.ashx
{
    /// <summary>
    /// ValidateCodeHandler 的摘要说明
    /// </summary>
    public class ValidateCodeHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            //用来校验用户输入的验证码     
            Common.ValidateCode validateCode = new Common.ValidateCode();
            string code = validateCode.CreateValidateCode(4);
            context.Session["Vcode"] = code;
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