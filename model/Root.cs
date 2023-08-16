using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class Root
    {
        public List<object> TaxType { get; set; }
        public IsicTaxonomys IsicTaxonomys { get; set; }
        public List<MultipleTin> MultipleTin { get; set; }
        public List<GuinData> GuinData { get; set; }
        public List<OfficeLocation> OfficeLocation { get; set; }
    }
    public class IsicTaxonomys
    {
        public int uid { get; set; }
        public int id { get; set; }
        public string occupation { get; set; }
        public string category { get; set; }
        public object createdDate { get; set; }
        public object updatedDate { get; set; }
        public bool pit { get; set; }
        public bool defaultTaxtype { get; set; }
    }
    public class MultipleTin
    {
        public int uid { get; set; }
        public string national_id { get; set; }
        public int gra_uid { get; set; }
        public string tin_number { get; set; }
        public string nia_uid { get; set; }
        public string map_status { get; set; }
        public object loginuser { get; set; }
        public object comment { get; set; }
    }
    public class GuinData
    {

        public int uid { get; set; }
        public string forenames { get; set; }
        public string surname { get; set; }
        public string prev_or_maiden_name { get; set; }
        public string sex { get; set; }
        public string occupation { get; set; }
        public string marital_status { get; set; }
        public string date_of_birth { get; set; }
        public string birth_town { get; set; }
        public string birth_country { get; set; }
        public string birth_region { get; set; }
        public string birth_district { get; set; }
        public string nationality { get; set; }
        public string resident { get; set; }
        public string social_security_no { get; set; }
        public string mother_maiden_name { get; set; }
        public string mother_forename { get; set; }
        public string national_id { get; set; }
        public string issue_date { get; set; }
        public string expiry_date { get; set; }
        public string country_of_issue { get; set; }
        public string place_of_issue { get; set; }
        public string card_number { get; set; }
        public string house_number { get; set; }
        public string street_name { get; set; }
        public string town { get; set; }
        public string city { get; set; }
        public string community { get; set; }
        public string country { get; set; }
        public string region { get; set; }
        public string district { get; set; }
        public string postal_address { get; set; }
        public string phone_number_1 { get; set; }
        public object phone_number_2 { get; set; }
        public string email { get; set; }
        public string tin_number { get; set; }
        public object tin_issued_date { get; set; }
        public DateTime last_update { get; set; }
        public DateTime created_date { get; set; }
        public string dig_Longitude { get; set; }
        public string dig_Latitude { get; set; }
        public string dig_Street { get; set; }
        public string dig_Region { get; set; }
        public string dig_Area { get; set; }
        public string dig_District { get; set; }
        public string dig_PostCode { get; set; }
        public string ghana_post_address { get; set; }
        public int location_uid { get; set; }
        public object refisicID { get; set; }
        public string registration_STATUS { get; set; }
    }
    public class OfficeLocation
    {
        public int id { get; set; }
        public string ghanaPostGps { get; set; }
        public string office { get; set; }
        public string location { get; set; }
        public object contact { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public double distance { get; set; }
        public string region { get; set; }
        public string officeName { get; set; }
    }
}
