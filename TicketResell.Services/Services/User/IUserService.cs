using Microsoft.AspNetCore.Mvc;
using Repositories.Core.Dtos.User;
using Repositories.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Services.Services
{
    public interface IUserService
    {
        public Task<ResponseModel> CreateUserAsync(UserCreateDto dto);

        public Task<ResponseModel> GetUserByIdAsync(string id);

        public Task<ResponseModel> UpdateUserAsync(string id, UserUpdateDto dto);


        public Task<ResponseModel> DeleteUserAsync(string id);
    }
}