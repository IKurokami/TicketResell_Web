using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class RatingRepository : GenericRepository<Rating>, IRatingRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public RatingRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Rating>> GetRatingsBySellerIdAsync(string sellerId)
    {
        try
        {
            return await _context.Ratings
                .Where(r => r.SellerId == sellerId)
                .Include(r => r.User)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching ratings for seller {sellerId}: {ex.Message}");
            throw;
        }
    }

    public async Task<List<Rating>> GetRatingsByUserIdAsync(string userId)
    {
        try
        {
            return await _context.Ratings
                .Where(r => r.UserId == userId)
                .Include(r => r.Seller) // Includes the seller details for each rating
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error fetching ratings by user {userId}: {ex.Message}");
            throw;
        }
    }
}