using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class TinsByNiaDto
    {
        public int uid { get; set; }
        public string national_id { get; set; }
        public int gra_uid { get; set; }
        public string tin_number { get; set; }
        public string nia_uid { get; set; }
        public object map_status { get; set; }
    }
}
