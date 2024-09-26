using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Core.Dtos;

namespace App.ApiRequest;

public interface ITicketRequest
{
    Task<IEnumerable<TickerReadDto>?> GetAllTicketsAsync();
}