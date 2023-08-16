using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class RegisterInputModel
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        //[Required]
        public string Phone { get; set; }
        [Required]
        public string BTin { get; set; }
        [Required]
        public int Role { get; set; } //*Role -> [Admin=1 / Default=0]
        [Required]
        public string CompanyId { get; set; }
        public string BusinessName { get; set; }
    }
}
