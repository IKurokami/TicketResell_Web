using AutoMapper;
using Backend.Core.Dtos.Order;
using Backend.Core.Dtos.OrderDetail;
using Backend.Core.Entities;
using Backend.Core.Dtos.User;
using Backend.Core.Dtos.SellConfig;
using Backend.Core.Dtos.Role;

namespace Backend.Core.AutoMapperConfig
{
    public class AutoMapperConfigProfile : Profile
    {
        public AutoMapperConfigProfile() 
        {
            CreateMap<UserCreateDto, User>();
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
        }
    }
}
