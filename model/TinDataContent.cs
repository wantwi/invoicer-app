using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class TinDataContent
    {
        public string registration_STATUS { get; set; }
        public int uid { get; set; }
        public string tin { get; set; }
        public string entity_TYPE { get; set; }
        public string edr { get; set; }
        public string legal_STATUS { get; set; }
        public string office { get; set; }
        public string marital_STATUS { get; set; }
        public string place_OF_BIRTH { get; set; }
        public string previous_LAST_NAME { get; set; }
        public string mother_MAIDEN_NAME { get; set; }
        public string date_OF_BIRTH { get; set; }
        public string gender { get; set; }
        public string title { get; set; }
        public string first_NAME { get; set; }
        public string middle_NAME { get; set; }
        public string last_NAME { get; set; }
        public string nationality { get; set; }
        public string trading_AS { get; set; }
        public string origin { get; set; }
        public string country_OF_BIRTH { get; set; }
        public string company_REG_NO { get; set; }
        public string mother_LAST_NAME { get; set; }
        public string mother_FIRST_NAME { get; set; }
        public string mother_MIDDLE_NAME { get; set; }
        public int id { get; set; }
    }


    public class GraTinDataDto
    {
        public List<TinDataContent> content { get; set; }
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
}