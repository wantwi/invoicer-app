using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class GeneralResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorCode { get; set; }
        public string Message { get; set; }
        public object ErrorDetails { get; set; }
    }
}
