using AutoMapper;
using Backend.Core.Dtos.Category;
using Backend.Core.Dtos.Revenue;
using Backend.Core.Dtos.Ticket;
using Backend.Core.Entities;
using Backend.Core.Dtos.User;
using Category = Backend.Core.Entities.Category;

namespace Backend.Core.AutoMapperConfig
{
    public class AutoMapperConfigProfile : Profile
    {
        public AutoMapperConfigProfile() 
        {
            CreateMap<UserCreateDto, User>();
            
            //Revenue
            CreateMap<RevenueCreateDto, Revenue>();
            CreateMap<Revenue,RevenueReadDto>();
            CreateMap<RevenueUpdateDto, Revenue>();
            
            //Ticket
            CreateMap<TicketCreateDto, Ticket>();
            CreateMap<Ticket, TickerReadDto>();
            CreateMap<TicketUpdateDto, Ticket>();
            
            //Category
            CreateMap<CategoryCreateDto, Category>();
            CreateMap< Category,CategoryReadDto>();
            CreateMap<CategoryUpdateDto, Category>();
        }
    }
}
