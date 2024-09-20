
using Backend.Core.Context;
using Backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.SellConfig_Repository
{
    public class SellConfigRepository: ISellConfigRepository
    {
        public readonly TicketResellManagementContext _context;

        public SellConfigRepository(TicketResellManagementContext context)
        {
            _context = context;
        }

        public async Task createSellConfigAsync(SellConfig sellConfig)
        {
            await _context.SellConfigs.AddAsync(sellConfig);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SellConfig>> readSellConfigAsync()
        {
            IEnumerable<SellConfig> sellConfigs = await _context.SellConfigs.ToListAsync();
            return sellConfigs;
        }
        public async Task<SellConfig?> getSellConfigById(string sellConfigId)
        {
            return await _context.SellConfigs.FindAsync(sellConfigId);
        }
        public async Task<SellConfig> updateSellConfigAsync(SellConfig sellConfigUpdate)
        {
            _context.Entry(sellConfigUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return sellConfigUpdate;
        }

        public async Task<SellConfig> deleteSellConfigAsync(SellConfig sellConfigDelete)
        {
            _context.SellConfigs.Remove(sellConfigDelete);
            await _context.SaveChangesAsync();
            return sellConfigDelete;
        }
    }
}
