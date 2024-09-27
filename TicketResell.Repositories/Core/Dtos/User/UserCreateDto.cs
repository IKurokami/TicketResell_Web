using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repositories.Core.Dtos.User
{
    public class UserCreateDto
    {
        public string UserId { get; set; } = null!;

        public string? Username { get; set; }

        public string? Password { get; set; }

        public int? Status { get; set; }

        public DateTime? CreateDate { get; set; }

        public string? Gmail { get; set; }
    }
}