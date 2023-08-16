using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class CustomersDto
    {
        public Guid Id { get; set; }
        public string Tin { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Type { get; set; }
        public string Telephone { get; set; }
        public string DigitalAddress { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    
    public class CreateCustomersDto
    {
        public Guid CompanyId { get; set; }
        public string? CustomerTin { get; set; }
        public string CustomerName { get; set; }
        public string Type { get; set; }
        public string? CustomerTel { get; set; }
        public string? CustomerEmail { get; set; }
        public string? GhPostGps { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public string? DigitalAddress { get; set; }
        //public string ContactPersonName { get; set; }
        //public string ContactPersonPhone { get; set; }
        //public string ContactPersonPosition { get; set; }
    }
    public class CustomerDetailsDto
    {
        public Guid Id { get; set; }
        public string CustomerTin { get; set; }
        public string CustomerName { get; set; }
        public string CustomerTel { get; set; }
        public string CustomerEmail { get; set; }
        public string GhPostGps { get; set; }
        public string City { get; set; }
        public string Type { get; set; }
        public string? DigitalAddress { get; set; }
        public string? Address { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonPhone { get; set; }
        public string? ContactPersonPosition { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string Status { get; set; }
    }
    public class CustomersUpdateDto
    {
        public Guid Id { get; set; }
        public string? Tin { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? DigitalAddress { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }       
        public string? ContactPersonName { get; set; }
        public string? ContactPersonPhone { get; set; }
        public string? ContactPersonPosition { get; set; }
        public string? Status { get; set; }
    }
}
