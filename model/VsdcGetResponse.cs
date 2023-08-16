using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class VsdcGetResponse
    {
        public VsdcCompany company { get; set; }
        public vsdcHeader header { get; set; }
    }




    public class vsdcHeader
    {
        public string NUM { get; set; }
        public string FLAG { get; set; }
        public string REFUND_ID { get; set; }
    }

    public class vsdcMESSAGE
    {
        #region OLD
        //public string num { get; set; }
        //public string flag { get; set; }
        //public string ysdcid { get; set; }
        //public string ysdcrecnum { get; set; }
        //public string ysdcintdata { get; set; }
        //public string ysdcregsig { get; set; }
        //public int ysdcitems { get; set; }
        //public string ysdcmrc { get; set; }
        //public string ysdcmrctim { get; set; }
        //public string ysdctime { get; set; }
        //public string QR_CODE { get; set; } 
        #endregion


        public string flag { get; set; }
        public string ysdcrecnum { get; set; }
        public string num { get; set; }
        public string ysdcid { get; set; }
        public string ysdcintdata { get; set; }
        public string ysdcmrc { get; set; }
        public int ysdcitems { get; set; }
        public string ysdcmrctim { get; set; }
        public string ysdcregsig { get; set; }
        public string ysdctime { get; set; }
    }
    public class vsdcPersolMESSAGE
    {
        public string status { get; set; }
        public string num { get; set; }
        public string ysdcid { get; set; }
        public string ysdcrecnum { get; set; }
        public string ysdcintdata { get; set; }
        public string ysdcregsig { get; set; }
        public string ysdcmrc { get; set; }
        public string ysdcmrctim { get; set; }
        public string ysdctime { get; set; }
        public string tin { get; set; }
        public string flag { get; set; }
        public string qr_url { get; set; }
        public string print_qr_url { get; set; }
        public string print_qr_url_idahishe { get; set; }
        public string ysdstatus { get; set; }
        public int ysdcitems { get; set; }
        public string signature { get; set; }
    }

    public class vsdcRESPONSE
    {
        #region OLD
        //public string DISTRIBUTOR_TIN { get; set; }
        //public string STATUS { get; set; }
        ////public object MESSAGE { get; set; }
        //public vsdcMESSAGE MESSAGE { get; set; } 
        #endregion



        public string DISTRIBUTOR_TIN { get; set; }
        public vsdcMESSAGE MESSAGE { get; set; }
        public string STATUS { get; set; }
        public string QR_CODE { get; set; }
    }

    public class vsdcRoot
    {
        public vsdcRESPONSE RESPONSE { get; set; }
    }
    public class rcdRoot
    {
        public string TIN { get; set; }
        public string FONE { get; set; }
        public string EMAIL { get; set; }
        public string SECURITY_KEY { get; set; }
        public string TIME { get; set; }
        public string NAME_USER { get; set; }
        public string NAME_COMPANY { get; set; }
        public string APPROVAL_STATUS { get; set; }
        public string REQUESTED_TIME { get; set; }
    }
    public class rcdApiRoot
    {
        public string TIN { get; set; }
        public string NAME_USER { get; set; }
        public string NAME_COMPANY { get; set; }
        public bool AlreadyRegistered { get; set; }
    }
    public class usrnsRoot
    {
        public bool Exists { get; set; }
        public string[]? Suggested { get; set; }
        
    }
    public class rcdReq
    {
        public string TIN { get; set; }
        public string OTP { get; set; }

    }
    public class MainApiMessage
    {
        public string num { get; set; }
        public string ysdcid { get; set; }
        public string ysdcrecnum { get; set; }
        public string ysdcintdata { get; set; }
        public string ysdcregsig { get; set; }
        public string ysdcmrc { get; set; }
        public string ysdcmrctim { get; set; }
        public string ysdctime { get; set; }
        public string flag { get; set; }
        public string ysdcitems { get; set; }
    }

    public class MainApiResponse
    {
        public string distributor_tin { get; set; }
        public MainApiMessage mesaage { get; set; }
        public string qr_code { get; set; }
        public int status { get; set; }
        public string timestamp { get; set; }
        public string error { get; set; }
    }

    public class MainApiResponseRoot
    {
        public Response response { get; set; }
    }
}
