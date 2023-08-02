using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdHOCInvoicingApp.Helpers;
using System.IdentityModel.Tokens.Jwt;

namespace AdHOCInvoicingApp.Controllers.Base
{
    [Route("[controller]")]
    [ApiController]
    public abstract class GlobalController : ControllerBase
    {
        public static string EvatAdHOCBaseUrl = APISettings.Current.EvatAdHOCBaseUrl;
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
        protected async Task<string> UserInfo()
        {
            var token = await HttpContext.GetUserAccessTokenAsync();
            var handler = new JwtSecurityTokenHandler();
            var decodeToken = handler.ReadJwtToken(token.AccessToken);
            //var tin = decodeToken.Claims.Where(x => x.Type == "TIN");
            var userInfo = decodeToken.Claims.First(claim => claim.Type == "sub").Value;
            return userInfo ?? string.Empty;
        }

    }
}
