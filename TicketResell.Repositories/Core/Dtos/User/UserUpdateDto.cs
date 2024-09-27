using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repositories.Core.Dtos.User
{
    public class UserUpdateDto
    {
        public string UserId { get; set; } = null!;

        public string? SellConfigId { get; set; }

        public string? Username { get; set; }

        public string? Password { get; set; }

        public int? Status { get; set; }

        public DateTime? CreateDate { get; set; }

        public string? Gmail { get; set; }

        public string? Fullname { get; set; }

        public string? Sex { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public string? Avatar { get; set; }

        public DateTime? Birthday { get; set; }

        public string? Bio { get; set; }

        public int? Verify { get; set; }
    }
}