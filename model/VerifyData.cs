using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class VerifyData : HashData
    {
        public string InvoiceNo { get; set; }

        public string DateTime { get; set; }

        public string Amount { get; set; }

        public string ItemCount { get; set; }

        public string TIN { get; set; }

        public string BranchNo { get; set; }

    }
}
