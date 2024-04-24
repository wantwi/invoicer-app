using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdHOCInvoicingApp.Helpers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AdHOCInvoicingApp.Controllers.Base
{
    [Route("[controller]")]
    [ApiController]
    public abstract class GlobalController : ControllerBase
    {
        public static string EvatAdHOCBaseUrl = APISettings.Current.EvatAdHOCBaseUrl;
        public static string REACT_APP_DASHBOARD_URL = APISettings.Current.REACT_APP_DASHBOARD_URL;
        public static string REACT_APP_USERS_MGT_URL = APISettings.Current.REACT_APP_USERS_MGT_URL;
        public static string ReportServiceUrl = APISettings.Current.ReportServiceUrl;
        public static string ReportServerUrl = APISettings.Current.ReportServerUrl;
        public static string ReportPath = APISettings.Current.ReportPath;
        public GlobalController()
        {

        }


        [ApiExplorerSettings(IgnoreApi = true)]
        protected async Task<string> AccessToken()
        {
            var token = await HttpContext.GetUserAccessTokenAsync();

            return token.AccessToken ?? string.Empty;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        protected async Task<tokenData> UserInfo()
        {
            var token = await HttpContext.GetUserAccessTokenAsync();
            var handler = new JwtSecurityTokenHandler();
            var decodeToken = handler.ReadJwtToken(token.AccessToken);
            var claims = decodeToken.Claims.ToList();
            var companyName = claims.FirstOrDefault(x => x.Type == "COMPANY_NAME").Value;
            var sub = claims.FirstOrDefault(x => x.Type == "COMPANY_ID").Value;
            var tin = claims.FirstOrDefault(x => x.Type == "TIN").Value;

            return new tokenData 
            { 
                CompanyName=companyName,
                Sub=sub,
                TIN= tin
            };
            
        }
        protected class tokenData
        {
            public string TIN { get; set; }
            public string CompanyName { get; set; }
            public string Sub { get; set; }
        }

    }
}
