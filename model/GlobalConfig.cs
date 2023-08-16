using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class GlobalConfig
    {
        public static GlobalConfig Current;

        public GlobalConfig()
        {
            Current = this;
        }

        public string FrontAppUrl { get; set; }
        public string OtpUrl { get; set; }
    }

}