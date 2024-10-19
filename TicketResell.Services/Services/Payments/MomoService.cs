using AutoMapper;
using Microsoft.Extensions.Options;
using Repositories.Core.Dtos.Payment;
using System.Security.Cryptography;
using System.Text;
using TicketResell.Repositories.UnitOfWork;
using System.Net.Http.Json;
using TicketResell.Services.Services.Payments;
using Repositories.Config;
using System.Text.Json;

namespace TicketResell.Services.Services
{
    public class MomoService : IMomoService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly AppConfig _config;

        private readonly string _ipnUrl;
        private readonly string _redirectUrl;
        private readonly string _momoApiUrl;

        private const string OrderInfo = "Demo tích hợp SDK MOMO";
        private const string ExtraData = "eyJ1c2VybmFtZSI6ICJtb21vIn0=";

        public MomoService(IUnitOfWork unitOfWork, IMapper mapper, HttpClient httpClient, IOptions<AppConfig> config)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpClient = httpClient;
            _config = config.Value;

            _ipnUrl = $"{_config.BaseUrl}/payment-return?method=momo";
            _redirectUrl = $"{_config.BaseUrl}/payment-return?method=momo";
            _momoApiUrl = _config.MomoApiUrl;
        }

        public async Task<ResponseModel> CreatePaymentAsync(PaymentDto paymentRequest, double amount)
        {

            if (string.IsNullOrEmpty(paymentRequest.RequestId) || string.IsNullOrEmpty(paymentRequest.OrderId))
            {
                return ResponseModel.BadRequest("requestId, orderId, and amount are required.");
            }

            // Build the signature string
            string signatureString = $"accessKey={_config.MomoAccessKey}&amount={amount}&extraData={ExtraData}&ipnUrl={_ipnUrl}&orderId={paymentRequest.OrderId}&orderInfo={OrderInfo}&partnerCode={_config.MomoPartnerCode}&redirectUrl={_redirectUrl}&requestId={paymentRequest.RequestId}&requestType=captureWallet";

            // Create SHA256 signature
            string signature = CreateSignature(signatureString, _config.MomoSecretKey);

            // Prepare the MoMo payment request payload
            var payload = new
            {
                partnerCode = _config.MomoPartnerCode,
                partnerName = "Tên doanh nghiệp SDK4ME",
                storeId = $"{_config.MomoPartnerCode}_1",
                requestId = paymentRequest.RequestId,
                amount = amount,
                orderId = paymentRequest.OrderId,
                orderInfo = OrderInfo,
                redirectUrl = _redirectUrl,
                ipnUrl = _ipnUrl,
                requestType = "captureWallet",
                extraData = ExtraData,
                lang = "vi",
                signature = signature
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_momoApiUrl}/v2/gateway/api/create", payload);
                string paymentUrl = await GetPayUrl(response);
                if (response.IsSuccessStatusCode)
                {
                    return ResponseModel.Success("Payment created successfully", paymentUrl);
                }

                return ResponseModel.Error("Failed to create MoMo payment");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error("Error occurred while processing payment.", ex.Message);
            }
        }

        public async Task<string> GetPayUrl(HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();

            // Deserialize the JSON content into a JsonDocument
            var jsonDoc = JsonDocument.Parse(content);

            // Directly access the payUrl property
            string payUrl = jsonDoc.RootElement.GetProperty("payUrl").GetString();

            return payUrl;
        }

        private string CreateSignature(string signatureString, string secretKey)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey)))
            {
                byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(signatureString));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }
}
