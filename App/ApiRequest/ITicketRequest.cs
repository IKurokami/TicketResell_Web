using System.Collections.Generic;
using System.Threading.Tasks;
using Repositories.Core.Dtos.Ticket;

namespace App.ApiRequest;

public interface ITicketRequest
{
    Task<IEnumerable<TickerReadDto>?> GetAllTicketsAsync();
}