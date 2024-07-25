using System.ComponentModel.DataAnnotations;

namespace AdHOCInvoicingApp.model
{
    public class InvoiceItem
    {
        public decimal? price { get; set; }
        public string? itemCode { get; set; }
        public string? itemDescription { get; set; }
        public decimal? unitPrice { get; set; }
        public decimal? itemDiscount { get; set; } = 0;
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
        public string? pon { get; set; } = "";
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
        public double? returnAmount { get; set; }
    }

    public class PurchaseReturn
    {
        public string purchaseId { get; set; }
        public string companyId { get; set; }
        public string branchCode { get; set; }
        public string nameOfUser { get; set; }
        public List<PurchaseReturnItem> purchaseReturnItems { get; set; }
    }



    public class NoteLine
    {
        public string InvoiceId { get; set; }
    }

    public class DebitCreditNote
    {
        public string CompanyId { get; set; }
        public string BranchId { get; set; }
        public string Tin { get; set; }
        public string Currency { get; set; }
        public int? ForexRate { get; set; }
        public string Name { get; set; }
        public string Reason { get; set; }
        public double? Amount { get; set; }
        public DateTime? Date { get; set; }
        public string NoteType { get; set; }
        public string NameOfUser { get; set; }
        public string Remarks { get; set; }
        public List<NoteLine> NoteLines { get; set; }
    }



    public class CheckInvoice
    {
        public string CustomerName { get; set; }
        public string CustomerTin { get; set; }
        public string Invoice { get; set; }
        public string CompanyId { get; set; }
        public string BranchId { get; set; }
        public string NoteType { get; set; }
    }

    public class InvoiceDevice
    {
        public string CompanyId { get; set; }
        [Required]
        public string SerialNumber { get; set; } = null!;
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Model { get; set; } = null!;
        [Required]
        public string Brand { get; set; } = null!;
        public string Status { get; set; } = "A";
    }

    public class InvoiceDeviceUpdate
    {
        public string CompanyId { get; set; }
        [Required]
        public string SerialNumber { get; set; } = null!;
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Model { get; set; } = null!;
        [Required]
        public string Brand { get; set; } = null!;

    }





}


