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
        public string REACT_APP_DASHBOARD_URL { get; set; }
        public string REACT_APP_USERS_MGT_URL { get; set; }
        public string ReportServiceUrl { get; set; }
        public string ReportServerUrl { get; set; }
        public string ReportPath { get; set; }
        public string DashboardUrl { get; set; }




    }
}
