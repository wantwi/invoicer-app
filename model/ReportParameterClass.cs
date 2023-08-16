using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{

    // Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
    public class ReportParameterClass
    {
        public string name { get; set; }
        public List<string> values { get; set; }
        public List<string> labels { get; set; }
        public bool nullable { get; set; }
    }
}
