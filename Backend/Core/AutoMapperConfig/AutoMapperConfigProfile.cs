using AutoMapper;
using Backend.Core.Dtos.Category;
using Backend.Core.Dtos.Revenue;
using Backend.Core.Dtos.Order;
using Backend.Core.Dtos.OrderDetail;
using Backend.Core.Entities;
using Backend.Core.Dtos.User;
using Backend.Core.Dtos.SellConfig;
using Backend.Core.Dtos.Role;
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
