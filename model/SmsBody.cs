using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class SmsBody
    {
        public string Tel { get; set; }
        public string InvoiceNumber { get; set; }
        public string Vat { get; set; }
        public string TotalPayable { get; set; }
        public string ReportLink { get; set; }
        public string Tin { get; set; }
        public string TaxpayerName { get; set; }
        public string InvoiceDate { get; set; }
    }
}
