using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Core.Dtos.Rating
{
    public class RatingCreateDto
    {
        public string RatingId { get; set; } = null!;

        public string? SellerId { get; set; }

        public int? Stars { get; set; }

        public string? Comment { get; set; }

    }
}