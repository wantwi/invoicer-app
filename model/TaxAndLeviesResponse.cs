using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class TaxAndLeviesResponse
    {
        public decimal nhilRate { get; set; }
        public decimal getfundRate { get; set; }
        public decimal covidRate { get; set; }
        public decimal tourismRate { get; set; }
        public decimal cstRate { get; set; }
        public decimal vatRate { get; set; }
        public decimal cstWithVat { get; set; }
        public decimal trsmWithVat { get; set; }
        public decimal regularLeviesWithVat { get; set; }
    }
}
