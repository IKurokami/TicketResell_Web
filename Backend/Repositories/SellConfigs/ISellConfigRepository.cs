using Backend.Core.Entities;
namespace Backend.Repositories
{
    public interface ISellConfigRepository
    {
        Task createSellConfigAsync(SellConfig sellConfig);
        Task<IEnumerable<SellConfig>> readSellConfigAsync();
        Task<SellConfig?> getSellConfigByIdAsync(string sellConfigId);
        Task<SellConfig> updateSellConfigAsync(SellConfig sellConfigUpdate);
        Task<SellConfig> deleteSellConfigAsync(SellConfig sellConfigDelete);
        
    }
}
