using AutoMapper;
using Repositories.Core.Dtos.Ticket;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using System.Net.Sockets;
using TicketResell.Repositories.Core.Dtos.Ticket;
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

        public async Task<ResponseModel> GetTicketsStartingWithinTimeRangeAsync(int ticketAmount, TimeSpan timeRange)
        {
            var tickets = await _unitOfWork.TicketRepository.GetTicketsStartingWithinTimeRangeAsync(ticketAmount, timeRange);

            if (tickets == null || !tickets.Any())
            {
                return ResponseModel.NotFound("No tickets found in the specified time range.");
            }

            var ticketDtos = _mapper.Map<List<TicketTopDto>>(tickets);
            return ResponseModel.Success($"Successfully retrieved {tickets.Count} tickets", ticketDtos);
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
                        return ResponseModel.BadRequest("Category not found");
                    }
                }
            }


            byte[] qrCodeBytes = null;
            if (dto.Qrcode != null)
            {
                try
                {
                    var mimeTypes = new Dictionary<string, string>
                    {
                        { "data:image/png;base64,", ".png" },
                        { "data:image/jpeg;base64,", ".jpg" },
                        { "data:image/webp;base64,", ".webp" }
                    };
                    
                    foreach (var mimeType in mimeTypes.Keys)
                    {
                        if (dto.Qrcode.StartsWith(mimeType))
                        {
                            dto.Qrcode = dto.Qrcode.Substring(mimeType.Length);
                            break;
                        }
                    }
                    
                    qrCodeBytes = Convert.FromBase64String(dto.Qrcode);
                }
                catch (FormatException)
                {
                    return ResponseModel.BadRequest("Invalid QR code format");
                }
            }

            newTicket.Qr = qrCodeBytes;
            newTicket.CreateDate = DateTime.UtcNow;
            newTicket.ModifyDate = DateTime.UtcNow;

            await _unitOfWork.TicketRepository.CreateTicketAsync(newTicket, dto.CategoriesId);
            if (saveAll) await _unitOfWork.CompleteAsync();
            return ResponseModel.Success("Successfully created Ticket", dto);

            if (saveAll)
            {
                await _unitOfWork.CompleteAsync();
            }

            return ResponseModel.Success("Successfully created Ticket");
        }


        public async Task<ResponseModel> CheckExistId(string id)
        {
            var check = await _unitOfWork.TicketRepository.CheckExist(id);
            if (!check)
            {
                return ResponseModel.BadRequest("Id is not Existed");
            }

            return ResponseModel.Success("Id is existed");
        }

        public async Task<ResponseModel> GetTicketByNameAsync(string name)
        {
            var ticket = await _unitOfWork.TicketRepository.GetTicketByNameAsync(name);

            var ticketDtos = _mapper.Map<List<TicketReadDto>>(ticket);
            return ResponseModel.Success($"Successfully get ticket: {ticketDtos}", ticketDtos);
        }

        public async Task<ResponseModel> GetTicketBySellerId(string id)
        {
            var tickets = await _unitOfWork.TicketRepository.GetTicketBySellerId(id);
            var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
            return ResponseModel.Success($"Successfully get ticket : {ticketDtos}", ticketDtos);
        }

        public async Task<ResponseModel> GetTopTicket(int amount)
        {
            var ticket = await _unitOfWork.TicketRepository.GetTopTicketBySoldAmount(amount);
            var ticketDtos = _mapper.Map<List<TicketTopDto>>(ticket);

            return ResponseModel.Success($"Successfully get top ticket", ticketDtos);
        }

        public async Task<ResponseModel> GetQrImageAsBase64Async(string ticketId)
        {
            return ResponseModel.Success($"Successfully get qr",
                await _unitOfWork.TicketRepository.GetQrImageAsBase64Async(ticketId));
        }

        public async Task<ResponseModel> GetTicketsAsync()
        {
            var tickets = await _unitOfWork.TicketRepository.GetAllAsync();

            var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
            return ResponseModel.Success($"Successfully get ticket", ticketDtos);
        }

        public async Task<ResponseModel> GetTicketRangeAsync(int start, int count)
        {
            var tickets = await _unitOfWork.TicketRepository.GetTicketRangeAsync(start, count);

            if (tickets == null || !tickets.Any())
            {
                return ResponseModel.NotFound("No tickets found in the specified range");
            }

            var ticketDtos = _mapper.Map<List<TicketReadDto>>(tickets);
            return ResponseModel.Success($"Successfully retrieved {tickets.Count} tickets", ticketDtos);
        }

        public async Task<ResponseModel> GetTicketByDateAsync(DateTime date)
        {
            var ticket = await _unitOfWork.TicketRepository.GetTicketByDateAsync(date);


            var ticketDtos = _mapper.Map<List<TicketReadDto>>(ticket);
            return ResponseModel.Success($"Successfully get ticket: {ticketDtos}", ticketDtos);
        }


        public async Task<ResponseModel> GetTicketByIdAsync(string id)
        {
            var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(id);

            var ticketDtos = _mapper.Map<TicketReadDto>(ticket);
            return ResponseModel.Success($"Successfully get ticket:{ticketDtos}", ticketDtos);
        }

        public async Task<ResponseModel> UpdateTicketAsync(string id, TicketUpdateDto? dto, bool saveAll)
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
            if (saveAll) await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully updated ticket: {ticket.TicketId}");
        }

        public async Task<ResponseModel> DeleteTicketAsync(string id, bool saveAll)
        {
            await _unitOfWork.TicketRepository.DeleteTicketAsync(id);
            if (saveAll) await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully deleted Ticket(s) with id: {id}");
        }

        public async Task<ResponseModel> GetTicketByCategoryAsync(string id)
        {
            var cate = await _unitOfWork.TicketRepository.GetTicketCateByIdAsync(id);
            return ResponseModel.Success($"Successfully get Category of Ticket with id: {id}", cate);
        }

        public async Task<ResponseModel> GetTicketRemainingAsync(string id)
        {
            var count = await _unitOfWork.TicketRepository.GetTicketRemainingAsync(id);
            return ResponseModel.Success($"Successfully get Category of Ticket with id: {id}", count);
        }

        public async Task<ResponseModel> GetTicketByCategoryIdAsync(string [] id)
        {
            var tickets = await _unitOfWork.TicketRepository.GetTicketByCateIdAsync(id);
            var ticketDtos = _mapper.Map<TicketReadByCateDto>(tickets);
            return ResponseModel.Success($"Successfully get Ticket by Category", ticketDtos);
        }
    }
}