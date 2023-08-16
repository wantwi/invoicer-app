using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class VatItemsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;        
        public bool? Taxable { get; set; }
        public string? CurrencyCode { get; set; }
        public string? OtherLevies { get; set; }
        public string? Status { get; set; }
        public bool? IsTaxInclusive { get; set; }
        public decimal? Price { get; set; }
        public string Description { get; set; }
        public bool? HasTrans { get; set; }

        public string? Code { get; set; }
        public decimal? TaxRate { get; set; }
    }
}
