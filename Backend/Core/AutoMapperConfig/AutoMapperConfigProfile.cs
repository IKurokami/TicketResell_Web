using AutoMapper;
using Backend.Core.Dtos.Order;
using Backend.Core.Dtos.OrderDetail;
using Backend.Core.Entities;
using Backend.Core.Dtos.User;

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
            CreateMap<OrderDetail, OrderDetailDto>();
        }
    }
}
