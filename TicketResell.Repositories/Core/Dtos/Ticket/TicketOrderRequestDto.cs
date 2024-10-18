using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Core.Dtos.Ticket
{
    public class TicketOrderRequestDto
    {
        public string userId { get; set; } = null!;

        public int status { get; set; } = 0;
    }
}