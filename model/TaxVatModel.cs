using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class TaxVatModel
    {
        public decimal TotalVat { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
