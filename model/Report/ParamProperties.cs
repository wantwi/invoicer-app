using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model.Report
{
    public class ParamProperties
    {
        public string? ParamName { get; set; }
        public string? Value { get; set; }
        public string? Type { get; set; }
        public bool IsRequired { get; set; }
        public string? Placeholder { get; set; }
    }
}
