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
using System.Text.Json.Nodes;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Reflection.Metadata;
using System.Security.Cryptography;

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
        // sales
        [HttpGet("GetTransactionSummary/{period}/{pageNumber}/{pageSize}/{branchId}")]
        public async Task<IActionResult> GetTransactionSummary(int period, int pageNumber, int pageSize, string branchId)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/GetTransactionsSummaryByCompanyId/{period}?CompanyId={user.Sub}&PageNumber={pageNumber}&PageSize={pageSize}&BranchId={branchId}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("GetSalesInvoicesByCompanyId")]
        public async Task<IActionResult> GetSalesInvoicesByCompanyId()
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/GetSalesInvoicesByCompanyId/{user.Sub}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("GetSalesInvoicesByCompanyId/{search}")]
        public async Task<IActionResult> GetSalesInvoicesByCompanyIdSearch(string search)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/GetSalesInvoicesByCompanyId/{user.Sub}/?filter={search}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("GetSalesInvoicesDetail/{invoiceNo}")]
        public async Task<IActionResult> GetSalesInvoicesDetail(string invoiceNo)
        {
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/{invoiceNo}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetByInvoiceNoTaxpayerId/{value}")]
        public async Task<IActionResult> GetByInvoiceNoTaxpayerId(string value)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/GetByInvoiceNoTaxpayerId/{value}/{user.Sub.ToUpper()}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("GetCurrency")]
        public async Task<IActionResult> GetCurrency()
        {
            string url = $"{EvatAdHOCBaseUrl}v4/Currency";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetRates/{branchCode}/{currencyCode}/{period}/{pageNumber}/{pageSize}")]
        public async Task<IActionResult> GetRates(string branchCode, string currencyCode, int period, int pageNumber, int pageSize)
        {
            if (currencyCode == "all")
            {
                currencyCode = "";
            }
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/TransactionCurrency/{user.Sub}/{branchCode}?currencyCode={currencyCode}&PageNumber={pageNumber}&PageSize={pageSize}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("checkIfRatesExist/{branchCode}/{currency}/{issuedDate}")]
        public async Task<IActionResult> checkIfRatesExist(string currency, string issuedDate, string branchCode)
        {
            var user = await UserInfo();

            string url = $"{EvatAdHOCBaseUrl}v4/TransactionCurrency/{user.Sub}/{branchCode}/{issuedDate}/{currency}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);
        }


        [HttpGet("GetCustomers/{branch}")]
        public async Task<IActionResult> GetCustomers(string branch)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Customers/GetCustomerByCompanyId/{user.Sub}/{branch}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetProductList/{currency}")]
        public async Task<IActionResult> GetProductList(string currency)
        {
            var user = await UserInfo();

            string url = $"{EvatAdHOCBaseUrl}v4/VatItems/GetByCompanyId/{user.Sub}/{currency}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetPOItems/{poNumber}/{tin}")]
        public async Task<IActionResult> GetPOItems(string poNumber, string tin)
        {
            var user = await UserInfo();

            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/GetPurchaseOrderByReference/{user.Sub}/{poNumber}/{tin}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpPost("PostInvoice/{branchId}")]
        public async Task<IActionResult> PostInvoice([FromBody] CreateInvoiceDto data, string branchId)
        {
            var user = await UserInfo();
            data.companyId = user.Sub;
            data.branchId = branchId;

            var client = _httpClientFactory.CreateClient();
            //client.DefaultRequestHeaders.Add("usr", user.CompanyName);
            //client.DefaultRequestHeaders.Add("usr", $"{user.CompanyName}");


            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/Sales";
            var json = JsonConvert.SerializeObject(data);

            //    httpContent.Headers.Add("usr", user.CompanyName);

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");

            // var response = await client.PostAsJsonAsync(url, data);
            var response = await client.PostAsync(url, content);
            var dataObj = string.Empty;

            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { data = dataObj, status = response.StatusCode });
            }

        }

        [HttpPost("GenerateVATInvoiceReportAsync")]
        public async Task<IActionResult> PostInvoice([FromBody] string invoiceNo)
        {
            var client = _httpClientFactory.CreateClient();
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Reports/GenerateVATInvoiceReportAsync?Id={invoiceNo}";
            // var response = await client.PostAsJsonAsync(url, invoiceNo);

            var content = new StringContent(JsonConvert.SerializeObject(invoiceNo), System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync(url, content);
            var dataObj = string.Empty;

            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { data = dataObj, response = response });
            }

            //if (response.StatusCode.ToString() == "BadRequest")
            //{
            //    throw new Exception("Error Occurred");
            //}
            //else if (response.IsSuccessStatusCode)
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    var secResult = JsonConvert.DeserializeObject<string>(result);
            //    return Ok(secResult);
            //}
            //else
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    //return new JsonResult(new { result });
            //    var error = JsonConvert.DeserializeObject<ErrorModel>(result);
            //    return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            //}
        }

        // Items section

        [HttpGet("GetItemsList")]
        public async Task<IActionResult> GetItemsList()
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/VatItems/GetByCompanyId/{user.Sub}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }
        [HttpGet("GetItemsList/{search}")]
        public async Task<IActionResult> SearchItem(string search)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/VatItems/GetByCompanyId/{user.Sub}?filter={search}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpPost("CreateItem/{branchCode}")]
        public async Task<IActionResult> CreateItem([FromBody] List<CreateItemDto> data, string branchCode)
        {
            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            for (int i = 0; i < data.Count; i++)
            {
                data[i].CompanyId = user.Sub;
                data[i].BranchCode = branchCode;
            }
            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/VatItems";

            var response = await client.PostAsync(url, content);
            var dataObj = string.Empty;

            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { data = dataObj, status = response.StatusCode });
            }


            // var response = await client.PostAsync(url, content);
            // if (response.StatusCode.ToString() == "BadRequest")
            // {
            //     throw new Exception("Error Occurred");
            // }
            // else if (response.IsSuccessStatusCode)
            // {
            //     var result = await response.Content.ReadAsStringAsync();
            //     return new JsonResult(new { result });
            // }
            // else
            // {
            //     var result = await response.Content.ReadAsStringAsync();
            //     //return new JsonResult(new { result });
            //     var error = JsonConvert.DeserializeObject<ErrorModel>(result);
            //     return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            // }
        }

        [HttpPost("AddExchangeRate/{branchCode}")]
        public async Task<IActionResult> AddExcahngeRate([FromBody] List<ExchangeRateDto> data, string branchCode)
        {
            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            for (int i = 0; i < data.Count; i++)
            {
                data[i].companyId = user.Sub;
                data[i].branchCode = branchCode;
            }
            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/TransactionCurrency";

            var response = await client.PostAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }

        [HttpPut("UpdateItem/{id}")]
        public async Task<IActionResult> UpdateItem([FromBody] UpdateItemDto data, Guid id)
        {
            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/VatItems/{id}";

            var response = await client.PutAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }

        [HttpDelete("DeleteItem/{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            var client = _httpClientFactory.CreateClient();
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/VatItems/{id}";

            var response = await client.DeleteAsync(url);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }


        //users section
        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.businessname = user.CompanyName;
            data.bTin = user.TIN;
            data.companyId = user.Sub;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Account/registrations";

            var response = await client.PostAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var res = await UserInfo();

            string url = $"{EvatAdHOCBaseUrl}v4/Account/GetUsersByCompanyTin/{res.TIN}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpPost("SendUserEmail")]
        public async Task<IActionResult> SendUserEmail([FromBody] SendInviteDto Id)
        {

            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonConvert.SerializeObject(Id), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Account/SendUserEmail";

            var response = await client.PostAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }


        [HttpPost("PostReportAction")]
        public async Task<IActionResult> PostReportAction([FromBody] PostReportActionDto data)
        {

            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/ReportViewer/PostReportAction";

            var response = await client.PostAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }
        [HttpPut("UpdateUserDto/{userId}")]
        public async Task<IActionResult> UpdateUserDto([FromBody] UpdateUserDto data, string userId)
        {

            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Account/UpdateUser/{userId}";

            var response = await client.PutAsync(url, content);
            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }

        [HttpGet("GetUsers/{search}")]
        public async Task<IActionResult> GetUsersSearch(string search)
        {
            var res = await UserInfo();

            string url = $"{EvatAdHOCBaseUrl}v4/Account/GetUsersByCompanyTin/{res.TIN}?filter={search}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetReportMeta/{reportType}")]
        public async Task<IActionResult> GetReportMeta(string reportType)
        {
            string url = $"{EvatAdHOCBaseUrl}v4/ReportMetadata/{reportType}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        // Business partner setup
        [HttpGet("GetCompanyCustomerslist/{branch}")]
        public async Task<IActionResult> GetCompanyCustomers(string branch)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Customers/GetCustomerByCompanyId/{user.Sub}/{branch}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("GetCompanyCustomers/{search}/{branch}")]
        public async Task<IActionResult> GetCompanyCustomersSearch(string search, string branch)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Customers/GetCustomerByCompanyId/{user.Sub}/{branch}?search={search}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("GetCompanySupplierslist/{branch}")]
        public async Task<IActionResult> GetCompanySuppliers(string branch)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Customers/GetSuppliersByCompanyId/{user.Sub}/{branch}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }



        [HttpGet("GetCompanySuppliers/{search}/{branch}")]
        public async Task<IActionResult> GetCompanySuppliersSearch(string search, string branch)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Customers/GetSuppliersByCompanyId/{user.Sub}/{branch}?search={search}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpPost("CreateCustomer")]
        public async Task<IActionResult> CreateCustomer([FromBody] List<CustomerDto> data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            for (int i = 0; i < data.Count; i++)
            {
                data[i].companyId = user.Sub;
            }


            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Customers";

            var response = await client.PostAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }



        [HttpPut("UpdateCreateCustomer/{customerId}")]
        public async Task<IActionResult> UpdateCreateCustomer([FromBody] UpdatePartnerDto data, string customerId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();

                var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
                client.SetBearerToken(await AccessToken());
                string url = $"{EvatAdHOCBaseUrl}v4/Customers/{customerId}";

                var response = await client.PutAsync(url, content);
                //var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });

                if (response.StatusCode.ToString() == "BadRequest")
                {
                    throw new Exception("Error Occurred");
                }
                else if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return new JsonResult(new { result });
                }
                else
                {
                    var result = await response.Content.ReadAsStringAsync();
                    //return new JsonResult(new { result });
                    var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                    return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        [HttpDelete("DeleteCustomer/{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            var client = _httpClientFactory.CreateClient();
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Customers/{id}";

            var response = await client.DeleteAsync(url);
            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

            //if (response.StatusCode.ToString() == "BadRequest")
            //{
            //    throw new Exception("Error Occurred");
            //}
            //else if (response.IsSuccessStatusCode)
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    return new JsonResult(new { result });
            //}
            //else
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    //return new JsonResult(new { result });
            //    var error = JsonConvert.DeserializeObject<ErrorModel>(result);
            //    return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            //}
        }


        // refunds
        [HttpGet("GetRefunds/{filter}/{pgNumber}/{pgSz}/{branchId}")]
        public async Task<IActionResult> GetRefunds(int filter, int pgSz, int pgNumber, string branchId)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/GetRefundInvoicesByCompanyId/{filter}?CompanyId={user.Sub}&PageNumber={pgNumber}&PageSize={pgSz}&BranchId={branchId}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetPurchaseReturns/{filter}/{pgNumber}/{pgSz}/{branchId}")]
        public async Task<IActionResult> GetPurchaseReturns(int filter, int pgSz, int pgNumber, string branchId)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/GetPurchaseReturnsByCompanyId/{filter}?CompanyId={user.Sub}&PageNumber={pgNumber}&PageSize={pgSz}&BranchId={branchId}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }


        [HttpGet("GetRefundsSearch/{search}")]
        public async Task<IActionResult> GetRefundsSearch(string search)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/GetRefundInvoicesByCompanyId/6?CompanyId={user.Sub}&Filter={search}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetPurchaseReturnsSearch/{search}")]
        public async Task<IActionResult> GetPurchaseReturnSearch(string search)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/GetPurchaseReturnsByCompanyId/6?CompanyId={user.Sub}&Filter={search}";

            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetRefundsById/{refundId}")]
        public async Task<IActionResult> GetRefundsById(string refundId)
        {
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/GetRefundsById/{refundId}";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpPost("GenerateRefundReportAsync")]

        public async Task<IActionResult> GenerateRefundReportAsync([FromBody] string id)
        {
            var client = _httpClientFactory.CreateClient();
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Reports/GenerateRefundReportAsync?Id={id}";
            // var response = await client.PostAsJsonAsync(url, id);

            var content = new StringContent(JsonConvert.SerializeObject(id), System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync(url, content);
            var dataObj = string.Empty;

            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { data = dataObj, status = response.StatusCode });
            }



            //if (response.StatusCode.ToString() == "BadRequest")
            //{
            //    throw new Exception("Error Occurred");
            //}
            //else if (response.IsSuccessStatusCode)
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    var secResult = JsonConvert.DeserializeObject<string>(result);
            //    return Ok(secResult);
            //}
            //else
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    //return new JsonResult(new { result });
            //    return StatusCode(StatusCodes.Status500InternalServerError, result);
            //}
        }

        [HttpPost("GeneratePurchaseReturnInvoice")]

        public async Task<IActionResult> GeneratePurchaseReturnInvoice([FromBody] string id)
        {
            var client = _httpClientFactory.CreateClient();
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Reports/GeneratePurchaseVATInvoiceReportAsync?Id={id}";
            var response = await client.PostAsJsonAsync(url, id);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                var secResult = JsonConvert.DeserializeObject<string>(result);
                return Ok(secResult);
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                return StatusCode(StatusCodes.Status500InternalServerError, result);
            }
        }

        [HttpPost("PostRefund/{refundType}/{branchId}")]
        public async Task<IActionResult> PostRefund([FromBody] PartialRefundDto data, string refundType, string branchId)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.companyId = user.Sub;
            data.branchId = branchId;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/{refundType}";

            var response = await client.PostAsync(url, content);

          
            var dataObj = string.Empty;

            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { data = dataObj, status = response.StatusCode });
            }

            //if (response.StatusCode.ToString() == "BadRequest")
            //{
            //    throw new Exception("Error Occurred");
            //}
            //else if (response.IsSuccessStatusCode)
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    return new JsonResult(new { result });
            //}
            //else
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    //return new JsonResult(new { result });
            //    var error = JsonConvert.DeserializeObject<ErrorModel>(result);
            //    return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            //}
        }

        [HttpPost("PurchaseReturn")]
        public async Task<IActionResult> PostPurchaseReturn([FromBody] PurchaseReturn data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.companyId = user.Sub;


            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/PurchaseReturn";

            var response = await client.PostAsync(url, content);
            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

            //if (response.StatusCode.ToString() == "BadRequest")
            //{
            //    throw new Exception("Error Occurred");
            //}
            //else if (response.IsSuccessStatusCode)
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    return new JsonResult(new { result });
            //}
            //else
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    //return new JsonResult(new { result });
            //    var error = JsonConvert.DeserializeObject<ErrorModel>(result);
            //    return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            //}
        }


        // purchase
        [HttpGet("GetPurchase/{filter}/{pgNumber}/{pgSz}/{branchId}")]
        public async Task<IActionResult> GetPurchase(int filter, int pgNumber, int pgSz, string branchId)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/GetPurchaseInvoicesByCompanyId/{filter}?CompanyId={user.Sub}&PageNumber={pgNumber}&PageSize={pgSz}&BranchId={branchId}";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }
        [HttpGet("GetPurchaseSearch/{filter}/{pgNumber}/{pgSz}/{search}")]
        public async Task<IActionResult> GetPurchaseSearch(int filter, int pgNumber, int pgSz, string search)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/SearchPurchaseInvoicesByCompanyId/{user.Sub}/?filter={search}";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetPurchaseById/{id}")]
        public async Task<IActionResult> GetPurchaseById(string id)
        {
            string url = $"{EvatAdHOCBaseUrl}v4/Reports/GeneratePurchaseVATInvoiceReportAsync?Id={id}";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);
        }

        [HttpPost("GenerateVAPurchaseInvoiceReportAsync")]
        public async Task<IActionResult> GenerateVAPurchaseInvoiceReportAsync([FromBody] string invoiceNo)
        {
            var client = _httpClientFactory.CreateClient();
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Reports/GeneratePurchaseVATInvoiceReportAsync?Id={invoiceNo}";

            var content = new StringContent(JsonConvert.SerializeObject(invoiceNo), System.Text.Encoding.UTF8, "application/json");


            var response = await client.PostAsync(url, content);
            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }
            //var response = await client.PostAsJsonAsync(url, invoiceNo);

            //if (response.StatusCode.ToString() == "BadRequest")
            //{
            //    throw new Exception("Error Occurred");
            //}
            //else if (response.IsSuccessStatusCode)
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    var secResult = JsonConvert.DeserializeObject<string>(result);
            //    return Ok(secResult);
            //}
            //else
            //{
            //    var result = await response.Content.ReadAsStringAsync();
            //    //return new JsonResult(new { result });
            //    return StatusCode(StatusCodes.Status500InternalServerError, result);
            //}
        }

        [HttpPost("GenerateCreditReportAsync")]
        public async Task<IActionResult> GenerateCreditReportAsync([FromBody] string invoiceNo)
        {
            var client = _httpClientFactory.CreateClient();
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Reports/GenerateCreditReportAsync?Id={invoiceNo}";
            var response = await client.PostAsJsonAsync(url, invoiceNo);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                var secResult = JsonConvert.DeserializeObject<string>(result);
                return Ok(secResult);
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                return StatusCode(StatusCodes.Status500InternalServerError, result);
            }
        }

        [HttpPost("CreatePurchaseInvoice/{branchId}")]
        public async Task<IActionResult> CreatePurchaseInvoice([FromBody] PurchaseInvoiceDto data, string branchId)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.companyId = user.Sub;
            data.branchId = branchId;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/Purchase";

            var response = await client.PostAsync(url, content);

            if (response.StatusCode.ToString() == "BadRequest")
            {
                throw new Exception("Error Occurred");
            }
            else if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { result });
            }
            else
            {
                var result = await response.Content.ReadAsStringAsync();
                //return new JsonResult(new { result });
                var error = JsonConvert.DeserializeObject<ErrorModel>(result);
                return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }
        }

        //dashboard
        [HttpGet("GetDashboard")]
        public async Task<IActionResult> GetDashboardData()
        {
            var user = await UserInfo();

            return Ok(user.Sub);

        }

        [HttpGet("GetCompanyName")]
        public async Task<IActionResult> GetCompanyName()
        {
            var user = await UserInfo();

            return Ok(user.CompanyName);

        }

        [HttpGet("GetMenus")]
        public async Task<IActionResult> GetMenus()
        {
            string url = $"{REACT_APP_USERS_MGT_URL}/Users/menus/00000000-0000-0000-0000-400000000000";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetBranches")]
        public async Task<IActionResult> GetBranches()
        {
            string url = $"{REACT_APP_USERS_MGT_URL}/Users/branch-access";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }
        [HttpGet("GetApps")]
        public async Task<IActionResult> GetApps()
        {
            string url = $"{REACT_APP_USERS_MGT_URL}/Users/application";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpGet("GetVatAndLeviesByScheme/{date}/{taxScheme}")]
        public async Task<IActionResult> GetVatAndLeviesByScheme(string date, string taxScheme)
        {
            string url = $"{EvatAdHOCBaseUrl}v4/Tax/GetVatAndLeviesByScheme/{date}/{taxScheme}";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);

        }

        [HttpPost("CancelRefund")]
        public async Task<IActionResult> CancelRefund([FromBody] CancelRefundDTO data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.companyId = user.Sub;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/RefundCancellation";

            var response = await client.PostAsync(url, content);

            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

        }


        [HttpPost("CancelPurchaseReturn")]
        public async Task<IActionResult> CancelPurchaseReturn([FromBody] CancelRefundDTO data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.companyId = user.Sub;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Refunds/PurchaseReturnCancellation";

            var response = await client.PostAsync(url, content);

            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

        }
        [HttpPost("GetInvoice")]
        public async Task<IActionResult> GetInvoice([FromBody] CheckInvoice data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.CompanyId = user.Sub;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Notes/ValidateNoteInvoice";

            var response = await client.PostAsync(url, content);

            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

        }

        [HttpPost("RetryInvoice")]
        public async Task<IActionResult> RetryInvoice([FromBody] InvoiceIRetry data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.companyId = user.Sub;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/RetrySales";

            var response = await client.PostAsync(url, content);

            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

        }

        [HttpPost("RemoveInvoice")]
        public async Task<IActionResult> RemoveInvoice([FromBody] InvoiceIRetry data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.companyId = user.Sub;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Invoices/RemoveSale";

            var response = await client.PostAsync(url, content);

            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

        }


        [HttpPost("Note")]
        public async Task<IActionResult> DebitAndCredit([FromBody] DebitCreditNote data)
        {

            var client = _httpClientFactory.CreateClient();
            var user = await UserInfo();
            data.CompanyId = user.Sub;

            var content = new StringContent(JsonConvert.SerializeObject(data), System.Text.Encoding.UTF8, "application/json");
            client.SetBearerToken(await AccessToken());
            string url = $"{EvatAdHOCBaseUrl}v4/Notes";

            var response = await client.PostAsync(url, content);

            var dataObj = string.Empty;
            if (response.IsSuccessStatusCode)
            {
                dataObj = await response.Content.ReadAsStringAsync();
                if (dataObj == string.Empty)
                {
                    return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
                }
                return new JsonResult(new { status = response.StatusCode.ToString(), data = dataObj });
            }
            else
            {
                dataObj = await response.Content.ReadAsStringAsync();
                return new JsonResult(new { status = response.StatusCode, data = dataObj });
            }

        }

        // purchase
        [HttpGet("Notes/{filter}/{pgNumber}/{pgSz}/{branchId}/{type}")]
        public async Task<IActionResult> GetNotes(int filter, int pgNumber, int pgSz, string branchId, string type)
        {
            var user = await UserInfo();
            string url = $"{EvatAdHOCBaseUrl}v4/Notes/GetNotes?CompanyId={user.Sub}&PageNumber={pgNumber}&PageSize={pgSz}&BranchId={branchId}&transFilter={filter}&type={type}";
            var response = await _hTTPClientInterface.MakeRequestAsync(await AccessToken(), url, "GET");
            return Ok(response);
        }

        [HttpGet("ReportURL")]
        public async Task<IActionResult> GetReportURLs()
        {
            var access = await AccessToken();
            return new JsonResult(new { ReportPath, ReportServerUrl, ReportServiceUrl, access });
        }

        [HttpGet("UserInfo")]
        public async Task<IActionResult> UserDetail()
        {
            var user = await UserInfo();
            return new JsonResult(new { user, path = DashboardUrl, AuthURL });
        }

        [HttpGet("GetData")]
        public async Task<IActionResult> GetData()
        {
            var user = await UserInfo();
            return new JsonResult(new
            {
                DashboardId = GlobalAppSettings.EmbedDetails.DashboardId,
                ServerUrl = GlobalAppSettings.EmbedDetails.ServerUrl,
                EmbedType = GlobalAppSettings.EmbedDetails.EmbedType,
                Environment = GlobalAppSettings.EmbedDetails.Environment,
                SiteIdentifier = GlobalAppSettings.EmbedDetails.SiteIdentifier,
                companyId = user.Sub
            });
        }


        [HttpPost("AuthorizationServer")]
        public async Task<string> AuthorizationServer([FromBody] object embedQuerString)
        {
            var user = await UserInfo();
            var embedClass = Newtonsoft.Json.JsonConvert.DeserializeObject<EmbedClass>(embedQuerString.ToString());

            var embedQuery = embedClass.embedQuerString;

            //+ "&embed_datasource_filter=" + "[{&&CompanyId=654B6C19-3DA9-40C2-865F-827711F0C2B1&&FromDate=2022-01-01&&ToDate=2024-12-12&&Br_ch=003}]";


            // User your user-email as embed_user_email
            embedQuery += "&embed_user_email=" + GlobalAppSettings.EmbedDetails.UserEmail;
            //To set embed_server_timestamp to overcome the EmbedCodeValidation failing while different timezone using at client application.
            double timeStamp = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
            embedQuery += "&embed_server_timestamp=" + timeStamp;
            var embedDetailsUrl = "/embed/authorize?" + embedQuery + "&embed_signature=" + GetSignatureUrl(embedQuery);

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(embedClass.dashboardServerApiUrl);
                client.DefaultRequestHeaders.Accept.Clear();

                var result = client.GetAsync(embedClass.dashboardServerApiUrl + embedDetailsUrl).Result;
                string resultContent = result.Content.ReadAsStringAsync().Result;
                return resultContent;
            }

        }

        public string GetSignatureUrl(string queryString)
        {
            if (queryString != null)
            {
                var encoding = new System.Text.UTF8Encoding();
                var keyBytes = encoding.GetBytes(GlobalAppSettings.EmbedDetails.EmbedSecret);
                var messageBytes = encoding.GetBytes(queryString);
                using (var hmacsha1 = new HMACSHA256(keyBytes))
                {
                    var hashMessage = hmacsha1.ComputeHash(messageBytes);
                    return Convert.ToBase64String(hashMessage);
                }
            }
            return string.Empty;
        }
    }

}


