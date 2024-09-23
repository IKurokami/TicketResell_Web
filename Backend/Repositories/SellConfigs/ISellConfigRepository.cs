using Backend.Core.Entities;
namespace Backend.Repositories
{
    public interface ISellConfigRepository
    {
        Task CreateSellConfigAsync(SellConfig sellConfig);
        Task<IEnumerable<SellConfig>> ReadSellConfigAsync();
        Task<SellConfig?> GetSellConfigByIdAsync(string sellConfigId);
        Task<SellConfig> UpdateSellConfigAsync(SellConfig sellConfigUpdate);
        Task<SellConfig> DeleteSellConfigAsync(SellConfig sellConfigDelete);
    }
}
