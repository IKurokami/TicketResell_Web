using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using App.Contracts.Services;
using Api.Core.Dtos;

namespace App.ApiRequest;

public class TicketRequest : ITicketRequest
{
    private readonly IApiRepository _apiRepository;
    private readonly string _endPoint = "Ticket";

    public TicketRequest(IApiRepository apiRepository)
    {
        _apiRepository = apiRepository;
    }

    public async Task<IEnumerable<TickerReadDto>?> GetAllTicketsAsync()
    {
        return await _apiRepository.GetAsync<IEnumerable<TickerReadDto>>(_endPoint, "read");
    }
}