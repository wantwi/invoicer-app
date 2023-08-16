using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class UsernameStatus
    {
        public bool Exists { get; set; }
        public SuggestionList Suggestion { get; set; }
    }

    public class SuggestionList
    {
        public string UserName { get; set; }
    }
}
