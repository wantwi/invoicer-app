using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class UpdateUserDto
    {
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Role { get; set; }
        public bool UserStatus { get; set; }
    }
}
