using System.Threading.Tasks;

namespace App.Contracts.Services;

public interface IApiRepository
{
    Task<T> GetAsync<T>(string endpoint);
    Task<T> GetAsync<T>(string endpoint, params string[] parameters);

    Task<T> PostAsync<T>(string endpoint, object data);
    Task<T> PostAsync<T>(string endpoint, object data, params string[] parameters);
    
    Task<T> PutAsync<T>(string endpoint, object data);
    Task<T> PutAsync<T>(string endpoint, object data, params string[] parameters);
    
    Task<T> DeleteAsync<T>(string endpoint);
    Task<T> DeleteAsync<T>(string endpoint, params string[] parameters);
}