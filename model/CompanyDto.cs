using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class CompanyDto
    {
        public string? CompanyName { get; set; }
        public string? Tin { get; set; }
        public List<BranchesDto>? Branches { get; set; }
    }
    public class BranchesDto
    {
        public string? BranchName { get; set; }
        public string? BranchCode { get; set; }
    }
}
