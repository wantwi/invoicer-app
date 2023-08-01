namespace AdHOCInvoicingApp.Helpers
{
    public class IdentitySettings
    {
        public static IdentitySettings Current;

        public IdentitySettings()
        {
            Current = this;
        }
        public string Authority { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string ResponseType { get; set; }
        public string RedirectUrl { get; set; }
        public string[] Scope { get; set; }
        public string ResponseMode { get; set; }
        //Cookie related Settings
        public string CookieName { get; set; }
        public bool SameSiteMode { get; set; }
    }

   
}
