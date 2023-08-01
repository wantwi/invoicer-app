using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdHOCInvoicingApp.Helpers;


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

    }
}
