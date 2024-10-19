using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Repositories.Config;
using Repositories.Core.Dtos.Payment;
using TicketResell.Repositories.Logger;

namespace TicketResell.Services.Services.Payments
{
    public class PaypalService : IPaypalService
    {
        private readonly AppConfig _config;
        private readonly HttpClient _httpClient;
        private readonly IAppLogger _logger;
        public PaypalService(IOptions<AppConfig> config, HttpClient httpClient, IAppLogger logger)
        {
            _config = config.Value;
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ResponseModel> CreatePaymentAsync(PaymentDto paymentRequest, double amount)
        {
            try
            {
                var accessToken = await GenerateAccessTokenAsync();
                _logger.LogInformation(accessToken);
                var order = await CreatePayPalOrderAsync(accessToken, amount);
                _logger.LogInformation("TESTttt");

                return ResponseModel.Success("PayPal order created successfully", order);
            }
            catch (Exception ex)
            {
                return ResponseModel.Error($"Error creating PayPal payment: {ex.Message}");
            }
        }

        private async Task<string> GenerateAccessTokenAsync()
        {
            var auth = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_config.PayPalClientId}:{_config.PayPalSecret}"));

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.PayPalApiUrl}/v1/oauth2/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);
            request.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials")
            });

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<AccessTokenResponse>(content);
            return tokenResponse.AccessToken;
        }


        private async Task<string> CreatePayPalOrderAsync(string accessToken, double amount)
        {
            var orderRequest = new
            {
                intent = "CAPTURE",
                purchase_units = new[]
                {
                    new
                    {
                        reference_id = Guid.NewGuid().ToString(),
                        amount = new
                        {
                            currency_code = "USD",
                            value = amount.ToString("F2"),
                            breakdown = new
                            {
                                item_total = new
                                {
                                    currency_code = "USD",
                                    value = amount.ToString("F2")
                                }
                            }
                        }
                    }
                },
                application_context = new
                {
                    return_url = $"{_config.BaseUrl}/payment-return?method=paypal",
                    cancel_url = $"{_config.BaseUrl}/payment-return?method=paypal",
                    shipping_preference = "NO_SHIPPING",
                    user_action = "PAY_NOW",
                    brand_name = "TicketResell"
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_config.PayPalApiUrl}/v2/checkout/orders");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            request.Content = new StringContent(JsonSerializer.Serialize(orderRequest), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var orderResponse = JsonSerializer.Deserialize<PayPalOrderResponse>(content);

            return orderResponse.Links.FirstOrDefault(l => l.Rel == "approve")?.Href;
        }

        private class AccessTokenResponse
        {
            public string AccessToken { get; set; }
            public string TokenType { get; set; }
            public int ExpiresIn { get; set; }
        }

        private class PayPalOrderResponse
        {
            public string Id { get; set; }
            public string Status { get; set; }
            public List<PayPalLink> Links { get; set; }
        }

        private class PayPalLink
        {
            public string Href { get; set; }
            public string Rel { get; set; }
            public string Method { get; set; }
        }
    }


}