using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class InvoiceItemsDto
    {
        public Guid Id { get; set; }
        public decimal Price { get; set; }
        public decimal PayablePrice { get; set; }
        public string ItemCode { get; set; } = null!;
        public string ItemDescription { get; set; } = null!;
        public decimal TaxRate { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal ItemDiscount { get; set; }
        public string TaxCode { get; set; } = null!;
        public decimal AmountRefunded { get; set; }

        public decimal Quantity { get; set; }
        public decimal QuantityRefunded { get; set; }
        public decimal AvailableQuantity { get; set; }
        public decimal Vat { get; set; }
        public decimal? Nhil { get; set; }
        public decimal? Covid { get; set; }
        public decimal? GetFund { get; set; }
        //public Guid? VatItemId { get; set; }


    }
    public class InvoiceItemsDetailsDto
    {
        public Guid Id { get; set; }
        public decimal Price { get; set; }
        public decimal PayablePrice { get; set; }
        public string ItemCode { get; set; } = null!;
        public string ItemDescription { get; set; } = null!;
        public decimal TaxRate { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal ItemDiscount { get; set; }
        public string TaxCode { get; set; } = null!;
        public decimal AmountRefunded { get; set; }

        public decimal Quantity { get; set; }
        public decimal QuantityRefunded { get; set; }
        public decimal AvailableQuantity { get; set; }

        public decimal Vat { get; set; }
        public decimal? Nhil { get; set; }
        public decimal? Covid { get; set; }
        public decimal? GetFund { get; set; }
        //public Guid? VatItemId { get; set; }


    }
}
