using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class CurrencyDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public bool HomeCurrency { get; set; }
    }
}
