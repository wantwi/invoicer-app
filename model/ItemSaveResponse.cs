
using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class ItemSaveResponse<T>
    {
        public List<T> Succeeded { get; set; }
        public List<T> Failed { get; set; }
    }
}
