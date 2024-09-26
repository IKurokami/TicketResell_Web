using AutoMapper;
using Repositories.Core.Dtos.Category;
using Repositories.Core.Dtos.Revenue;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;
using Repositories.Core.Dtos.User;
using Repositories.Core.Dtos.SellConfig;
using Repositories.Core.Dtos.Role;
using Repositories.Core.Dtos.Ticket;
using Category = Repositories.Core.Entities.Category;

namespace Repositories.Core.AutoMapperConfig
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
