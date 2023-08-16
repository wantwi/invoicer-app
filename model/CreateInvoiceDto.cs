
using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class CreateInvoiceDto
    {
        public Guid CompanyId { get; set; }
        //public string SdcRecNo { get; set; } = null!;
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public string Remarks { get; set; } = null!;
        //public string SzType { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public string TransactionType { get; set; } = "SALES";
        public string? CustomerTinghcard { get; set; }
        public string Currency { get; set; }
        public decimal? ForexRate { get; set; }
        //public string CustomerEmail { get; set; } = null!;
        public decimal Amount { get; set; }
        public string DiscountType { get; set; } = "GENERAL";
        public decimal TotalDiscount { get; set; } = 0;

        public List< > InvoiceItems { get; set; }

    }
    public class CreatePurchaseInvoiceDto
    {
        public Guid CompanyId { get; set; }
        public DateTime Date { get; set; }
        public string SupplierName { get; set; } = null!;
        public string TransactionType { get; set; } = "PURCHASE";
        public string? Currency { get; set; }
        public decimal? ForexRate { get; set; }
        public string? SupplierTinghcard { get; set; }
        public string? InvoiceNo { get; set; }
        public decimal Amount { get; set; }
        public string? Ysdcid { get; set; }
        public string? Ysdcrecnum { get; set; }
        public string? Ysdcintdata { get; set; }
        public string? Ysdcregsig { get; set; }
        public int? Ysdcitems { get; set; }
        public string? Ysdcmrc { get; set; }
        public string? Ysdcmrctim { get; set; }
        public string? Ysdctime { get; set; }
        public List<CreatePurchaseInvoiceItemsDto> InvoiceItems { get; set; }

    }
    public class CreateRefundDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = null!;
        public Guid CompanyId { get; set; }
        public string? CustomerTinghcard { get; set; }



    }
    public class CreatePartialRefundDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = null!;
        public Guid CompanyId { get; set; }
        public string? CustomerTinghcard { get; set; }
        public List<CreatePartialInvoiceItemsDto> InvoiceItems { get; set; }
    }
    public class CreateEbmInvoiceDto
    {
        public string CompanyTin { get; set; }
        //public string CompanyName { get; set; }
        public string? Remarks { get; set; }
        //public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string CustomerName { get; set; } = null!;
        public string? CustomerTinghcard { get; set; }
        public string? CustomerTel { get; set; } = null!;
        public string? CustomerEmail { get; set; } = null!;
        public decimal Amount { get; set; }

        public List<CreateEbmInvoiceItemsDto> InvoiceItems { get; set; }

    }
    public class CreateEbmInvoiceZohoDto
    {
        public string CompanyTin { get; set; }

        public string? Remarks { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string CustomerName { get; set; } = null!;
        public string? CustomerTinghcard { get; set; }
        public string? CustomerTel { get; set; } = null!;
        public string? CustomerEmail { get; set; } = null!;
        public decimal Amount { get; set; }

        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }

        public string TransactionType { get; set; } = "SALES";
        public string Currency { get; set; } = "GHS";
        public decimal? ForexRate { get; set; }

        public string DiscountType { get; set; } = "GENERAL";
        public decimal TotalDiscount { get; set; } = 0;

        public List<CreateEbmInvoiceItemsZohoDto> InvoiceItems { get; set; }

    }
    public class CreateEbmInvoiceWithIdZohoDto
    {
        public string OrganizationId { get; set; }
        public string? Remarks { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string CustomerName { get; set; } = null!;
        public string? CustomerTinghcard { get; set; }
        public string? CustomerTel { get; set; } = null!;
        public string? CustomerEmail { get; set; } = null!;
        public decimal Amount { get; set; }

        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }

        public string TransactionType { get; set; } = "SALES";
        public string Currency { get; set; } = "GHS";
        public decimal? ForexRate { get; set; }

        public string DiscountType { get; set; } = "GENERAL";
        public decimal TotalDiscount { get; set; } = 0;

        public List<CreateEbmInvoiceItemsZohoDto> InvoiceItems { get; set; }

    }

    public class CreatePurchaseReturnDto
    {
        public Guid PurchaseId { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public List<CreatePurchaseReturnItemsDto> PurchaseReturnItems { get; set; }

    }
    public class CreatePurchaseReturnItemsDto
    {
        public decimal UnitPrice { get; set; }
        public decimal ItemDiscount { get; set; }
        public decimal Quantity { get; set; }
        public Guid? VatItemId { get; set; }
        public bool IsTaxable { get; set; }
        public bool IsTaxInclusive { get; set; }
        public string TrsmCst { get; set; }

    }
}
