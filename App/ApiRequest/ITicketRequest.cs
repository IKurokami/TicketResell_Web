using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Core.Dtos;

namespace App.ApiRequest;

public interface ITicketRequest
{
    Task<IEnumerable<TickerReadDto>?> GetAllTicketsAsync();
}