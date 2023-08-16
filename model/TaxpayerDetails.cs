using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class TaxpayerDetails
    {
        public string Name { get; set; }
        public string TinOrGuin { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
