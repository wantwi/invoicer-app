using System.ComponentModel.DataAnnotations;

namespace AdHOCInvoicingApp.model
{
    public class InvoiceItem
    {
        public decimal? price { get; set; }
        public string? itemCode { get; set; }
        public string? itemDescription { get; set; }
        public decimal? unitPrice { get; set; }
        public decimal? itemDiscount { get; set; }
        public string? taxCode { get; set; }
        public int? quantity { get; set; }
        public string? vatItemId { get; set; }
    }

    public class CreateInvoiceDto
    {
        public string? companyId { get; set; }
        public DateTime? date { get; set; }
        public DateTime? dueDate { get; set; }
        public string? remarks { get; set; }
        public string? customerName { get; set; }
        public string? transactionType { get; set; }
        public string? customerTinghcard { get; set; }
        public string? currency { get; set; }
        public decimal? forexRate { get; set; }
        public decimal? amount { get; set; }
        public string? discountType { get; set; } = "";
        public double? totalDiscount { get; set; } = 0.00;
        public List<InvoiceItem> invoiceItems { get; set; }
    }

    public class PartialRefundDto
    {
        public string id { get; set; }
        public string invoiceNumber { get; set; }
        public string? companyId { get; set; }
        public string customerTinghcard { get; set; }
        public List<RefundItems>? invoiceItems { get; set; }
    }

    public class RefundItems
    {
        public Guid vatItemId { get; set; }
        public decimal refundAmount { get; set; }  
        public int refundQuantity { get; set; }  
    }


}


