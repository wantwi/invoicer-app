using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class InvoiceSummaryDto
    {
        //public decimal TotalPayable { get; set; }
        //public long TotalNoInvoices { get; set; }
        //public decimal TotalVAT { get; set; }
        //public decimal TotalSalesPayable { get; set; }
        //public long TotalNoSalesInvoices { get; set; }
        //public decimal TotalSalesVAT { get; set; }
        //public decimal TotalPurchasePayable { get; set; }
        //public long TotalNoPurchaseInvoices { get; set; }
        //public decimal TotalPurchaseVAT { get; set; }

        public List<TransSummary> Summaries { get; set; }
        public PagedModel<InvoiceDto> Invoices { get; set; }
    }

    public class TransSummary
    {
        public string Currency { get; set; }
        public decimal TotalPayable { get; set; }
        public long TotalNoInvoices { get; set; }
        public decimal TotalVAT { get; set; }
        public decimal TotalSalesPayable { get; set; }
        public long TotalNoSalesInvoices { get; set; }
        public decimal TotalSalesVAT { get; set; }
        public decimal TotalPurchasePayable { get; set; }
        public long TotalNoPurchaseInvoices { get; set; }
        public decimal TotalPurchaseVAT { get; set; }
    }
}
