using Backend.Core.Entities;
namespace Backend.Repositories.SellConfig_Repository
{
    public interface ISellConfigRepository
    {
        Task createSellConfigAsync(SellConfig sellConfig);
        Task<IEnumerable<SellConfig>> readSellConfigAsync();
        Task<SellConfig?> getSellConfigById(string sellConfigId);
        Task<SellConfig> updateSellConfigAsync(SellConfig sellConfigUpdate);
        Task<SellConfig> deleteSellConfigAsync(SellConfig sellConfigDelete);
        
    }
}
