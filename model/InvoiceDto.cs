using System.ComponentModel.DataAnnotations;
namespace AdHOCInvoicingApp.model
{
    public class InvoiceDto
    {
        public Guid Id { get; set; }
        public string? InvoiceNo { get; set; }
        public string? RefundNo { get; set; }
        public string? Remarks { get; set; }
        public string SdcRecNo { get; set; } = null!;
        public DateTime Date { get; set; }
        //public DateTime? RefundDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalVat { get; set; }
        public string Currency { get; set; }
        public string CustomerName { get; set; } = null!;
        public string? CustomerTinghcard { get; set; }
        public string CustomerTel { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public decimal TotalRefundAmount { get; set; }
        public decimal TotalAmountToRefund { get; set; }
        public decimal TotalExVatAmount { get; set; }
        public decimal TotalPayable { get; set; }
        public decimal? TotalNhil { get; set; }
        public decimal? TotalCovid { get; set; }
        public decimal? TotalTourism { get; set; }
        public decimal? TotalCst{ get; set; }
        public decimal? TotalGetFund { get; set; }
        public decimal? TotalDiscount { get; set; }
        public string? Ysdcid { get; set; }
        public string? Ysdcrecnum { get; set; }
        public string? Ysdcintdata { get; set; }
        public string? Ysdcregsig { get; set; }
        public string? QrData { get; set; }
        public int? Ysdcitems { get; set; }
        public string? Ysdcmrc { get; set; }
        public string? Ysdcmrctim { get; set; }
        public string? Ysdctime { get; set; }
        public string? QrCode { get; set; }
        public string? SignatureStatus { get; set; }
        public string NameOfUser { get; set; }
        public string RefundType { get; set; }

        public List<InvoiceItemsDto> InvoiceItems { get; set; }
    }
    public class InvoiceDetailsDto
    {
        public Guid Id { get; set; }
        public string? InvoiceNo { get; set; }
        public string? Remarks { get; set; }
        public string SdcRecNo { get; set; } = null!;
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalVat { get; set; }
        public string Currency { get; set; }
        public string CustomerName { get; set; } = null!;
        public string? CustomerTinghcard { get; set; }
        public string CustomerTel { get; set; } = null!;
        public string CustomerEmail { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public decimal TotalExVatAmount { get; set; }
        public decimal TotalPayable { get; set; }
        public decimal? TotalNhil { get; set; }
        public decimal? TotalCovid { get; set; }
        public decimal? TotalTourism { get; set; }
        public decimal? TotalCst{ get; set; }
        public decimal? TotalGetFund { get; set; }
        public decimal? TotalDiscount { get; set; }
        public string? Ysdcid { get; set; }
        public string? Ysdcrecnum { get; set; }
        public string? Ysdcintdata { get; set; }
        public string? Ysdcregsig { get; set; }
        public string? QrData { get; set; }
        public int? Ysdcitems { get; set; }
        public string? Ysdcmrc { get; set; }
        public string? Ysdcmrctim { get; set; }
        public string? Ysdctime { get; set; }
        public string? QrCode { get; set; }
        public string? SignatureStatus { get; set; }
        public string NameOfUser { get; set; }

        public List<InvoiceItemsDetailsDto> InvoiceItems { get; set; }
    } 
}
