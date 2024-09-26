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
        public Task<IActionResult> CreateUserAsync(UserCreateDto dto);

        public Task<UserReadDto> GetUserByIdAsync(string id);

        public Task<IActionResult> UpdateUserAsync(string id, UserUpdateDto dto);


        public Task<IActionResult> DeleteUserAsync(string id);
    }
}