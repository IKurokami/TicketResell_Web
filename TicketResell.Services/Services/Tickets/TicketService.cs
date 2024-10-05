using AutoMapper;
using Repositories.Core.Dtos.Ticket;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Tickets;

namespace TicketResell.Services.Services
{
    public class TicketService : ITicketService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IValidatorFactory _validatorFactory;


        public TicketService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _validatorFactory = validatorFactory;
        }


        public async Task<ResponseModel> CreateTicketAsync(TicketCreateDto dto, bool saveAll)
        {
            var validatorTicket = _validatorFactory.GetValidator<Ticket>();
            Ticket newTicket = _mapper.Map<Ticket>(dto);
            var validationResult = validatorTicket.Validate(newTicket);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
            }

            if (dto.CategoriesId.Count > 0)
            {
                foreach (var id in dto.CategoriesId)
                {
                    Category? category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);

                    if (category == null)
                    {
                        return ResponseModel.BadRequest("category not found");
                    }
                }
            }

            newTicket.CreateDate = DateTime.UtcNow;
            newTicket.ModifyDate = DateTime.UtcNow;
            await _unitOfWork.TicketRepository.CreateTicketAsync(newTicket, dto.CategoriesId);
            if(saveAll) await _unitOfWork.CompleteAsync();
            return ResponseModel.Success("Successfully created Ticket");
        }

        public async Task<ResponseModel> GetTicketByNameAsync(string name)
        {
            var ticket = await _unitOfWork.TicketRepository.GetTicketByNameAsync(name);

            var ticketDtos = _mapper.Map<List<TickerReadDto>>(ticket);
            return ResponseModel.Success($"Successfully get ticket: {ticketDtos}", ticketDtos);
        }

        public async Task<ResponseModel> GetTicketsAsync()
        {
            var tickets = await _unitOfWork.TicketRepository.GetAllAsync();

            var ticketDtos = _mapper.Map<List<TickerReadDto>>(tickets);
            return ResponseModel.Success($"Successfully get ticket", ticketDtos);
        }
        
        public async Task<ResponseModel> GetTicketRangeAsync(int start, int count)
        {
            var tickets = await _unitOfWork.TicketRepository.GetTicketRangeAsync(start, count);

            if (tickets == null || !tickets.Any())
            {
                return ResponseModel.NotFound("No tickets found in the specified range");
            }

            var ticketDtos = _mapper.Map<List<TickerReadDto>>(tickets);
            return ResponseModel.Success($"Successfully retrieved {tickets.Count} tickets", ticketDtos);
        }

        public async Task<ResponseModel> GetTicketByDateAsync(DateTime date)
        {
            var ticket = await _unitOfWork.TicketRepository.GetTicketByDateAsync(date);


            var ticketDtos = _mapper.Map<List<TickerReadDto>>(ticket);
            return ResponseModel.Success($"Successfully get ticket: {ticketDtos}", ticketDtos);
        }


        public async Task<ResponseModel> GetTicketByIdAsync(string id)
        {
            var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(id);

            var ticketDtos = _mapper.Map<TickerReadDto>(ticket);
            return ResponseModel.Success($"Successfully get ticket:{ticketDtos}", ticketDtos);
        }

        public async Task<ResponseModel> UpdateTicketAsync(string id, TicketUpdateDto? dto,bool saveAll)
        {
            var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(id);


            ticket.ModifyDate = DateTime.UtcNow;
            _mapper.Map(dto, ticket);

            var validator = _validatorFactory.GetValidator<Ticket>();

            var validationResult = validator.Validate(ticket);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation error", validationResult.Errors);
            }

            _unitOfWork.TicketRepository.Update(ticket);
            if(saveAll) await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully updated ticket: {ticket.TicketId}");
        }

        public async Task<ResponseModel> DeleteTicketAsync(string id, bool saveAll)
        {
            await _unitOfWork.TicketRepository.DeleteTicketAsync(id);
            if(saveAll) await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully deleted Ticket(s) with id: {id}" );
        }

        public async Task<ResponseModel> GetTicketByCategoryAsync(string id)
        {
            var cate = await _unitOfWork.TicketRepository.GetTicketCateByIdAsync(id);
            return ResponseModel.Success($"Successfully get Category of Ticket with id: {id}",cate);
        }
    }
    
}

