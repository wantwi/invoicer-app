using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class VatItemCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool? Taxable { get; set; }
        public string? OtherLevies { get; set; }
        public bool? IsTaxInclusive { get; set; }
        public string? Code { get; set; }
        public string? CurrencyCode { get; set; }
        public decimal? TaxRate { get; set; }
        public decimal? Price { get; set; }
        public Guid CompanyId { get; set; }
    }
    public class UpdateVatItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Status { get; set; }
        public string? Description { get; set; }
        public bool? Taxable { get; set; }
        public string? Code { get; set; }
        public decimal? TaxRate { get; set; }
        public decimal? Price { get; set; }
        public string? CurrencyCode { get; set; }

        public string? OtherLevies { get; set; }
        public bool? IsTaxInclusive { get; set; }
        //public Guid CompanyId { get; set; }
    }
}
