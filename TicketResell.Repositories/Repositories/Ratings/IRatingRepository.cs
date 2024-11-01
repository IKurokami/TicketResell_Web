using Repositories.Core.Entities;

namespace Repositories.Repositories;

public interface IRatingRepository : IRepository<Rating>
{
    Task<List<Rating>> GetRatingsBySellerIdAsync(string id);
    Task<List<Rating>> GetRatingsByUserIdAsync(string userId);
}