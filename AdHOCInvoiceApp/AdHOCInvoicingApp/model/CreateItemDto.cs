using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class CreateItemDto
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
        public string? CompanyId { get; set; }
    }

    public class UpdateItemDto
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? status { get; set; }
        public string? description { get; set; }
        public bool? taxable { get; set; }
        public string? code { get; set; }
        public decimal? taxRate { get; set; }
        public decimal? price { get; set; }
        public string? currencyCode { get; set; }
        public string? otherLevies { get; set; }
        public bool? isTaxInclusive { get; set; }
    }

    public class ExchangeRateDto
    {
        public string currencyCode { get; set; }
        public string? companyId { get; set; }
        public string transactionDate { get; set; }
        public double exchangeRate { get; set; }
    }


    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class InvoiceItemPurchase
    {
        public decimal? unitPrice { get; set; }
        public decimal itemDiscount { get; set; }
        public decimal? quantity { get; set; }
        public string? vatItemId { get; set; }
        public bool? isTaxable { get; set; }
        public bool? isTaxInclusive { get; set; }
        public string? trsmCst { get; set; }
    }

    public class PurchaseInvoiceDto
    {
        public string? companyId { get; set; }
        public string? nameOfUser { get; set; }
        public string? branchId { get; set; }
        public DateTime? date { get; set; }
        public string? supplierName { get; set; }
        public string? transactionType { get; set; }
        public string? currency { get; set; }
        public decimal forexRate { get; set; }
        public string? supplierTinghcard { get; set; }
        public string invoiceNo { get; set; }
        public decimal amount { get; set; }
        public string? ysdcid { get; set; }
        public string? ysdcrecnum { get; set; }
        public string? ysdcintdata { get; set; }
        public string? ysdcregsig { get; set; }
        public int? ysdcitems { get; set; }
        public string? ysdcmrc { get; set; }
        public string? ysdcmrctim { get; set; }
        public string? ysdctime { get; set; }
        public List<InvoiceItemPurchase> invoiceItems { get; set; }
    }


}


