using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class InvoiceStockItems
    {
        public int UnitOfMeasure { get; set; }
        public decimal Quantity { get; set; }
        public Guid ItemId { get; set; }
    }
}
