using AutoMapper;
using Backend.Core.Entities;
using Backend.Core.Dtos.User;

namespace Backend.Core.AutoMapperConfig
{
    public class AutoMapperConfigProfile : Profile
    {
        public AutoMapperConfigProfile()
        {
            CreateMap<UserCreateDto, User>();
        }
    }
}
