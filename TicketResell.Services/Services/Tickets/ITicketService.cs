using Repositories.Core.Dtos.Ticket;

namespace TicketResell.Services.Services.Tickets;

public interface ITicketService
{
    public Task<ResponseModel> CreateTicketAsync(TicketCreateDto dto, bool saveAll = true);

    public Task<ResponseModel> GetTicketByNameAsync(string name);

    public Task<ResponseModel> GetTicketAsync();
    
    public Task<ResponseModel> GetTicketByDateAsync(DateTime date);
    public Task<ResponseModel> GetTicketByIdAsync(string id);

    public Task<ResponseModel> UpdateTicketAsync(string id, TicketUpdateDto? dto,bool saveAll = true);
    
    public Task<ResponseModel> DeleteTicketAsync(string id,bool saveAll = true);
    public Task<ResponseModel> GetTicketByCategoryAsync(string id);
     
}