namespace AdHOCInvoicingApp.Service
{
    public interface HTTPClientInterface
    {
        Task<string> MakeRequestAsync(string token, string url, string method, object dataToSend = null);
    }
}
