namespace AdHOCInvoicingApp.Helpers
{
    public class APISettings
    {
        public static APISettings Current;





        public APISettings()
        {
            Current = this;
        }

        public string EvatAdHOCBaseUrl { get; set; }

    }
}
