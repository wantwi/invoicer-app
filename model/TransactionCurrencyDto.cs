using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class TransactionCurrencyDto
    {
        public Guid Id { get; set; }
        public string CurrencyCode { get; set; } = null!;
        public DateTime TransactionDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? Status { get; set; }
        public decimal? ExchangeRate { get; set; }
    }
    public class TransactionCurrencyCreateResponseDto
    {
        public string Meessage { get; set; }
        public string CurrencyCode { get; set; } = null!;
        public string Status { get; set; }
    }
    public class CreateTransactionCurrencyDto
    {
        public string CurrencyCode { get; set; } = null!;
        public Guid CompanyId { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal? ExchangeRate { get; set; }
    }
    public class UpdateTransactionCurrencyDto
    {
        public Guid Id { get; set; }
        public string CurrencyCode { get; set; } = null!;
        public Guid CompanyId { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Status { get; set; }
        public decimal? ExchangeRate { get; set; }
    }
}
