using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class TinNiaMatchDto
    {
        public List<TinNiaMatchContent> content { get; set; }
        public Pageable pageable { get; set; }
        public int totalPages { get; set; }
        public bool last { get; set; }
        public int totalElements { get; set; }
        public bool first { get; set; }
        public int numberOfElements { get; set; }
        public Sort sort { get; set; }
        public int size { get; set; }
        public int number { get; set; }
    }

    public class TinNiaMatchContent
    {
        public int uid { get; set; }
        public string forenames { get; set; }
        public string surname { get; set; }
        public object prev_or_maiden_name { get; set; }
        public string sex { get; set; }
        public string occupation { get; set; }
        public string marital_status { get; set; }
        public string date_of_birth { get; set; }
        public string birth_town { get; set; }
        public string birth_country { get; set; }
        public string birth_region { get; set; }
        public object birth_district { get; set; }
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
        public string phone_number_2 { get; set; }
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
}