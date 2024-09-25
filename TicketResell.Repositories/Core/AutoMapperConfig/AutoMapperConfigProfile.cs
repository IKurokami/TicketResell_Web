using AutoMapper;
using TicketResell.Repository.Core.Dtos.Category;
using TicketResell.Repository.Core.Dtos.Order;
using TicketResell.Repository.Core.Dtos.OrderDetail;
using TicketResell.Repository.Core.Dtos.Revenue;
using TicketResell.Repository.Core.Dtos.Role;
using TicketResell.Repository.Core.Dtos.SellConfig;
using TicketResell.Repository.Core.Dtos.Ticket;
using TicketResell.Repository.Core.Dtos.User;
using TicketResell.Repository.Core.Entities;
using Category = TicketResell.Repository.Core.Entities.Category;

namespace TicketResell.Repository.Core.AutoMapperConfig
{
    public class AutoMapperConfigProfile : Profile
    {
        public AutoMapperConfigProfile()
        {
            CreateMap<UserCreateDto, User>();
            CreateMap<UserUpdateDto, User>();
            CreateMap<User, UserReadDto>();

            //Revenue
            CreateMap<RevenueCreateDto, Revenue>();
            CreateMap<Revenue, RevenueReadDto>();
            CreateMap<RevenueUpdateDto, Revenue>();
            
            //Order
            CreateMap<OrderDto, Order>();

            //OrderDetail
            CreateMap<OrderDetailDto, OrderDetail>();
            CreateMap<OrderDetail, OrderDetailDto>();
            
            CreateMap<SellConfigCreateDto, SellConfig>();
            CreateMap<SellConfig, SellConfigReadDto>();
            CreateMap<SellConfigUpdateDto, SellConfig>();
            CreateMap<RoleCreateDto, Role>();
            CreateMap<Role, RoleReadDto>();
            CreateMap<RoleUpdateDto, Role>();
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
