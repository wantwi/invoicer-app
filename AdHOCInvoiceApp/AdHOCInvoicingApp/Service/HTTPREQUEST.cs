using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using System.Net.Http;
using IdentityModel.Client;

namespace AdHOCInvoicingApp.Service
{
    public class HTTPREQUEST: HTTPClientInterface
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HttpClient client;

        public HTTPREQUEST(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            client = new HttpClient();
        }

        public async Task<string> MakeRequestAsync(string token,string url, string method, object dataToSend = null)
        {
            string data = null;
            HttpResponseMessage response = null;


            client.SetBearerToken(token);

            //client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);



            switch (method)
            {
                case "GET":
                    response = await client.GetAsync(url);
                    if (response.IsSuccessStatusCode)
                    {
                        data = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                        return JsonConvert.SerializeObject(new { data});
                    }
                    else
                    {
                        return JsonConvert.SerializeObject(new { ErrorMessage = response.ReasonPhrase, response.StatusCode });
                    }
                case "POST":
                    var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");

                    response = await client.PostAsync(url, content);

                    if (response.StatusCode.ToString() != "BadRequest")
                    {
                         data = await response.Content.ReadAsStringAsync();
                        return JsonConvert.SerializeObject(new { data});
                    }
                       
                    else
                    {
                        return JsonConvert.SerializeObject(new { IsCreated = false, ErrorMessage = response.ReasonPhrase, response.StatusCode });
                    }
                case "PUT":
                    response = await client.PutAsJsonAsync(url, dataToSend);
                    if (response.IsSuccessStatusCode)
                        return JsonConvert.SerializeObject(new { IsUpdated = true });
                    else
                    {
                        return JsonConvert.SerializeObject(new { IsUpdated = false, ErrorMessage = response.ReasonPhrase, response.StatusCode });
                    }
                case "DELETE":
                    response = await client.DeleteAsync(url).ConfigureAwait(false);
                    if (response.IsSuccessStatusCode)
                        return JsonConvert.SerializeObject(new { IsDeleted = true });
                    else
                    {
                        return JsonConvert.SerializeObject(new { IsDeleted = false, ErrorMessage = response.ReasonPhrase, response.StatusCode });
                    }
            }

            return JsonConvert.SerializeObject(new { ErrorMessage = "Method not defined" });
        }
    }
}
