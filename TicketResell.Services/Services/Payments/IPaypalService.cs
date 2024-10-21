using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Repositories.Core.Dtos.Payment;
using TicketResell.Repositories.Core.Dtos.Payment;

namespace TicketResell.Services.Services.Payments
{
    public interface IPaypalService
    {
        public Task<ResponseModel> CreatePaymentAsync(PaymentDto paymentRequest, double amount);
        public Task<ResponseModel> CheckTransactionStatus(string orderId);

        public Task<ResponseModel> CheckPayoutStatusAsync(string payoutBatchId);
        public Task<ResponseModel> CreatePayoutAsync(string orderId);

    }
}