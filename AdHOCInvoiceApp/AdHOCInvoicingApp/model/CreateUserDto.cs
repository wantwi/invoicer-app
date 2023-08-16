using System.ComponentModel.DataAnnotations;

namespace AdHOCInvoicingApp.model
{
    public class CreateUserDto
    {

        public string firstName { get; set; }

        public string lastName { get; set; } = null!;

        public string userName { get; set; }

        public string email { get; set; }
        public string phone { get; set; }
        public string? bTin { get; set; }

        public int role { get; set; }

        public string? companyId { get; set; }
        public string? businessname { get; set; }
        public bool userStatus { get; set; }

    }

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class UpdatePartnerDto
    {
        public string? id { get; set; }
        public string? tin { get; set; }
        public string? name { get; set; }
        public string? type { get; set; }
        public string? email { get; set; }
        public string? telephone { get; set; }
        public string? digitalAddress { get; set; }
        public string? city { get; set; }
        public string? address { get; set; }
        public string? contactPersonName { get; set; }
        public string? contactPersonPhone { get; set; }
        public string? contactPersonPosition { get; set; }
        public string? status { get; set; }
    }


    public class UpdateUserDto
    {

        public string firstName { get; set; }

        public string lastName { get; set; }

        public string userName { get; set; }

        public string email { get; set; }
        public string phoneNumber { get; set; }
        public int role { get; set; }
        public bool userStatus { get; set; }
    }

    public class CustomerDto
    {

        public string? companyId { get; set; }
        public string? customerTin { get; set; }
        public string? customerName { get; set; }
        public string? type { get; set; }
        public string? customerTel { get; set; }
        public string? customerEmail { get; set; }
        public string? ghPostGps { get; set; }
        public string? city { get; set; }
        public string? address { get; set; }
        public string? digitalAddress { get; set; }
    }

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class CustomBrandSettings
    {
        public bool hideHelpLink { get; set; }
        public string customDomain { get; set; }
        public string customBrandName { get; set; }
        public List<CustomLink> customLinks { get; set; }
    }

    public class CustomLink
    {
        public string name { get; set; }
        public string url { get; set; }
    }

    public class Parameter
    {
        public string name { get; set; }
        public List<string> labels { get; set; }
        public List<object> values { get; set; }
        public bool nullable { get; set; }
    }

    public class PostReportActionDto
    {
        public string reportAction { get; set; }
        public List<Parameter> parameters { get; set; }
        public bool isReloadReport { get; set; }
        public string controlId { get; set; }
        public string reportPath { get; set; }
        public bool enableVirtualEvaluation { get; set; }
        public string reportServerUrl { get; set; }
        public string processingMode { get; set; }
        public string locale { get; set; }
        public CustomBrandSettings customBrandSettings { get; set; }
    }


    public class SendInviteDto {
        public Guid Id {get; set;}
    }


}




