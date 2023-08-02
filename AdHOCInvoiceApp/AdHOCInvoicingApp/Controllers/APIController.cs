using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AdHOCInvoicingApp.Service;
using AdHOCInvoicingApp.Controllers.Base;
using Newtonsoft.Json.Linq;
using IdentityModel;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http;
using System;
using IdentityModel.Client;
using AdHOCInvoicingApp.model;

namespace AdHOCInvoicingApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class APIController : GlobalController
    {
        private readonly HTTPClientInterface _hTTPClientInterface;
        private readonly IHttpClientFactory _httpClientFactory;
        public APIController(IHttpClientFactory httpClientFactory, HTTPClientInterface hTTPClientInterface)
        {
            _hTTPClientInterface = hTTPClientInterface;
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("GetTransactionSummary/{period}/{pageNumber}/{pageSize}")]
        public async Task<IActionResult> GetTransactionSummary(int period, int pageNumber, int pageSize)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v1/Invoices/GetTransactionsSummaryByCompanyId/{period}?CompanyId={user}&PageNumber{pageNumber}1&PageSize={pageSize}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }
        [HttpGet("GetSalesInvoicesByCompanyId/{value}")]
        public async Task<IActionResult> GetSalesInvoicesByCompanyId(string value)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v1/Invoices/GetSalesInvoicesByCompanyId/{user}?filter={value}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetItemCategories")]
        public async Task<IActionResult> GetInvoicesData()
        {

            string url = $"{EvatAdHOCBaseUrl}/v1/Generic/GetItemCategories";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetTransactionCurrencies")]
        public async Task<IActionResult> GetTransactionCurrencies()
        {

            string url = $"{EvatAdHOCBaseUrl}/v1/Generic/GetTransactionCurrencies";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpPost("TaxSummary")]
        public async Task<IActionResult> PostTaxSummary([FromBody] CreateInvoiceDto data)
        {
            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}/v1/Invoice/TaxSummary";

            var response = await client.PostAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occured");
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
        }

        [HttpPost("SaveDraft")]
        public async Task<IActionResult> SaveDraft([FromBody] CreateInvoiceDto dataDto)
        {
            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonConvert.SerializeObject(dataDto), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}/v1/Invoice/SaveInvoice";

            var response = await client.PostAsync(url, content);
            var dataObj = string.Empty;


            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = int.Parse(response.StatusCode.ToString()), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = int.Parse(response.StatusCode.ToString()), data = dataObj });
            }
        }

        [HttpGet("Invoice")]
        public async Task<IActionResult> GetInvoices()
        {

            string url = $"{EvatAdHOCBaseUrl}/v1/Invoice/GetRecent";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }
    }

}

// api / v1 / Invoice / GetRecent
