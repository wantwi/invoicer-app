using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class CreateInvoiceItemsDto
    {
        public decimal Price { get; set; }
        public string ItemCode { get; set; } = null!;
        public string ItemDescription { get; set; } = null!;
        //public decimal TaxRate { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal ItemDiscount { get; set; }
        public string TaxCode { get; set; } = null!;
        public decimal Quantity { get; set; }
        public Guid? VatItemId { get; set; }
        //public bool IsTaxable { get; set; }

    }
    public class CreatePurchaseInvoiceItemsDto
    {
        //public decimal Price { get; set; }
        //public string ItemCode { get; set; } = null!;
        //public string ItemDescription { get; set; } = null!;
        //public decimal TaxRate { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal ItemDiscount { get; set; }
        //public string TaxCode { get; set; } = null!;
        public decimal Quantity { get; set; }
        public Guid? VatItemId { get; set; }
        public bool IsTaxable { get; set; }
        public bool IsTaxInclusive { get; set; }
        public string TrsmCst { get; set; }

    }
    public class CreatePartialInvoiceItemsDto
    {
        public short RefundQuantity { get; set; }
        public decimal RefundAmount { get; set; }
        public Guid? VatItemId { get; set; }

    }
    public class CreateEbmInvoiceItemsDto
    {
        public string ItemCode { get; set; } = null!;
        public string ItemDescription { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public decimal ItemDiscount { get; set; }
        public short Quantity { get; set; }
        public string TaxCode { get; set; }
        public bool? Taxable { get; set; }
        public bool? HasTourismLevy { get; set; }
        public bool? IsTaxInclusive { get; set; }
    }
    public class CreateEbmInvoiceItemsZohoDto
    {
        public string ItemCode { get; set; } = null!;
        public string ItemDescription { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public decimal ItemDiscount { get; set; }
        public short Quantity { get; set; }
        public string TaxCode { get; set; }
        public bool? Taxable { get; set; }
        public bool? HasTourismLevy { get; set; }
        public bool? HasCstLevy { get; set; }
        public bool? IsTaxInclusive { get; set; }
    }
}
