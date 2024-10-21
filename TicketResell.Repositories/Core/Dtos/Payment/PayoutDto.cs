using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Core.Dtos.Payment
{
    public class PayoutDto
    {
        public double Amount { get; set; }
        public string RecipientEmail { get; set; }
    }
}