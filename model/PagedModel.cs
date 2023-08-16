
using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class PagedModel<T>
    {
        public PagingHeader Paging { get; set; }
        public List<LinkInfo> Links { get; set; }
        public List<T> Items { get; set; }
    }
}
