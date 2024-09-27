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
        public Task<ResponseModel> CreateUserAsync(UserCreateDto dto, bool saveAll = true);

        public Task<ResponseModel> GetUserByIdAsync(string id);

        public Task<ResponseModel> UpdateUserByIdAsync(string id, UserUpdateDto dto, bool saveAll = true);


        public Task<ResponseModel> DeleteUserByIdAsync(string id, bool saveAll = true);
    }
}