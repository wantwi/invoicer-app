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
        public decimal? quantity { get; set; }
        public string? vatItemId { get; set; }
    }

    public class CreateInvoiceDto
    {
        public string? companyId { get; set; }
        public string? nameOfUser { get; set; }
        public string? branchId { get; set; }
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
        public string? nameOfUser { get; set; }
        public string? branchId { get; set; }
        public string customerTinghcard { get; set; }
        public List<RefundItems>? invoiceItems { get; set; }
    }

    public class RefundItems
    {
        public string vatItemId { get; set; }
        public decimal refundAmount { get; set; }  
        public int refundQuantity { get; set; }  
    }

    public class CancelRefundDTO
    {
        public string itemId { get; set; }
        public string companyId { get; set; }
        public string branchCode { get; set; }
        public string nameOfUser { get; set; }
    }

    public class PurchaseReturnItem
    {
        public int? returnQuantity { get; set; }
        public string vatItemId { get; set; }
        public int? returnAmount { get; set; }
    }

    public class PurchaseReturn
    {
        public string purchaseId { get; set; }
        public string companyId { get; set; }
        public string branchCode { get; set; }
        public string nameOfUser { get; set; }
        public List<PurchaseReturnItem> purchaseReturnItems { get; set; }
    }

    public class Invoice
    {
        public string InvoiceNo { get; set; }
        public int? Amount { get; set; }
        public DateTime? Date { get; set; }
    }

    public class DebitCreditNote
    {
        public string CompanyId { get; set; }
        public string BranchId { get; set; }
        public string Tin { get; set; }
        public string Name { get; set; }
        public string Reason { get; set; }
        public int? Amount { get; set; }
        public DateTime? Date { get; set; }
        public string NoteType { get; set; }
        public List<Invoice> Invoices { get; set; }
    }




}


