
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.Options;
using Repositories.Config;
using Repositories.Core.Dtos.Payment;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.Payments
{
    public class VnpayService : IVnpayService
    {
        private SortedList<String, String> _requestData = new SortedList<String, String>(new VnPayCompare());

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly AppConfig _config;
        private readonly string _redirectUrl;
        private readonly string _vnpayApiUrl;

        private readonly string _tmnCode;
        private readonly string _hashSecret;

        public VnpayService(IUnitOfWork unitOfWork, IMapper mapper, HttpClient httpClient, IOptions<AppConfig> config)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpClient = httpClient;
            _config = config.Value;

            _redirectUrl = $"{_config.BaseUrl}/payment-return?method=vnpay";
            _vnpayApiUrl = _config.VnpayApiUrl;

            // Initialize environment variables
            _tmnCode = _config.TmnCode;
            _hashSecret = _config.HashSecret;
        }

        public Task<ResponseModel> CreatePaymentAsync(PaymentDto dto, double amount)
        {
            string clientIPAddress = GetClientIPAddress();

            AddRequestData("vnp_Version", "2.1.0");
            AddRequestData("vnp_Command", "pay");
            AddRequestData("vnp_TmnCode", _tmnCode);  // Use the environment variable
            AddRequestData("vnp_Amount", DoubleToString(amount));
            AddRequestData("vnp_BankCode", "");
            AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            AddRequestData("vnp_CurrCode", "VND");
            AddRequestData("vnp_IpAddr", clientIPAddress);
            AddRequestData("vnp_Locale", "vn");
            AddRequestData("vnp_OrderInfo", "Payment for " + dto.OrderId);
            AddRequestData("vnp_OrderType", "other");
            AddRequestData("vnp_ReturnUrl", _redirectUrl);
            AddRequestData("vnp_TxnRef", dto.OrderId);

            string paymentUrl = CreateRequestUrl(_vnpayApiUrl, _hashSecret);  // Use the environment variable
            return Task.FromResult(ResponseModel.Success("Payment created successfully", paymentUrl));
        }
        static string DoubleToString(double value)
        {
            // Round the double to the nearest integer
            int roundedValue = (int)Math.Round(value);
            // Multiply by 100
            int multipliedValue = roundedValue * 100;
            // Convert to string
            return multipliedValue.ToString();
        }
        private string GetClientIPAddress()
        {
            try
            {
                string hostName = Dns.GetHostName();
                IPAddress[] addresses = Dns.GetHostAddresses(hostName);
                IPAddress? ipv4Address = addresses.FirstOrDefault(a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
                return ipv4Address?.ToString() ?? "127.0.0.1";
            }
            catch (Exception)
            {
                return "127.0.0.1";
            }
        }

        public void AddRequestData(string key, string value)
        {
            if (!String.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }
        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            StringBuilder data = new StringBuilder();
            foreach (KeyValuePair<string, string> kv in _requestData)
            {
                if (!String.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }
            string queryString = data.ToString();

            baseUrl += "?" + queryString;
            String signData = queryString;
            if (signData.Length > 0)
            {

                signData = signData.Remove(data.Length - 1, 1);
            }
            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnp_SecureHash;

            return baseUrl;
        }
        public static String HmacSHA512(string key, String inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

    }
    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}