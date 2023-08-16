using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class InvoiceResponse<T>
    {
        public bool IsRefunded { get; set; }
        public T? Body { get; set; }
    }
}
