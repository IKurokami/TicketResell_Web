using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Repositories.Core.Entities;
using Repositories.Repositories;

namespace Repositories.Repositories
{
    public interface IRatingRepository: IRepository<Rating>
    {
        Task<List<Rating>> GetRatingsBySellerIdAsync(string id);
        Task<List<Rating>> GetRatingsByUserIdAsync(string userId);
    }
}