using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Core.Dtos.Ticket
{
    public class TicketCategoryRequestDto
    {
        public required string CategoryName { get; set; }
        public int Amount { get; set; }
    }
}