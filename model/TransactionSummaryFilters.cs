using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public enum TransactionSummaryFilters
    {
        Recent=0,
        ThisWeek = 1,
        ThisMonth =2,
        LastMonth = 3,
        ThisYear    =4,
        LastYear = 5,
        All = 6,
        Custom = 7
    }
}
