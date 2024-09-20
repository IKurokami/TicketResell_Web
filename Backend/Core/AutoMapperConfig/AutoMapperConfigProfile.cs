using AutoMapper;
using Backend.Core.Entities;
using Backend.Core.Dtos.User;
using Backend.Core.Dtos.SellConfig;

namespace Backend.Core.AutoMapperConfig
{
    public class AutoMapperConfigProfile : Profile
    {
        public AutoMapperConfigProfile() 
        {
            CreateMap<UserCreateDto, User>();
            CreateMap<SellConfigCreateDto, SellConfig>();
            CreateMap<SellConfig, SellConfigReadDto>();
            CreateMap<SellConfigUpdateDto, SellConfig>();
        }
    }
}
