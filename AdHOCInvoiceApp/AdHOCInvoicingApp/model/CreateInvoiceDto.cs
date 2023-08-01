using System.ComponentModel.DataAnnotations;

namespace AdHOCInvoicingApp.model
{
    public class CreateInvoiceDto
    {

        public string? CustomerTinghcard { get; set; }

        public string CustomerName { get; set; } = null!;

        public string? Currency { get; set; }

        public string? Status { get; set; }
        public string? DueDate { get; set; }
        public string? Date { get; set; }

        public decimal? ForexRate { get; set; }

        public decimal Amount { get; set; }
        public string DiscountType { get; set; } = "GENERAL";
        public decimal TotalDiscount { get; set; } = 0;

        public string Remarks { get; set; } = null!;
        [Required]
        public List<CreateInvoiceItemsDto>? InvoiceItems { get; set; }
    }
    public class CreateInvoiceItemsDto
    {

        public string ItemDescription { get; set; } = null!;

        public decimal UnitPrice { get; set; }

        public decimal Quantity { get; set; }

        public Guid? ItemCategoryId { get; set; }
        public decimal ItemDiscount { get; set; }




    }
}
