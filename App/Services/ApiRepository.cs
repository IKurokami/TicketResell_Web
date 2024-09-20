using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using App.Contracts.Services;
using static App.Helpers.JsonHelper;
using Newtonsoft.Json;

namespace App.Services;

public class ApiRepository : IApiRepository
{
    private readonly HttpClient _httpClient;

    public ApiRepository()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(Configuration.APIUrl)
        };
    }

    private string UrlBuilder(string endpoint, params string[] parameters)
    {
        string url = endpoint;
        if (parameters.Length > 0)
        {
            url += "/" + string.Join("/", parameters);
        }

        return url;
    }

    public async Task<T> GetAsync<T>(string endpoint)
    {
        return await GetAsync<T>(endpoint, null);
    }

    public async Task<T> GetAsync<T>(string endpoint, params string[] parameters)
    {
        T result = default(T);
        try
        {
            var response = await _httpClient.GetAsync(UrlBuilder(endpoint, parameters));
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            result = await ToObjectAsync<T>(content);
        }
        catch (HttpRequestException httpRequestException)
        {
        }
        catch (Exception exception)
        {
        }

        return result;
    }

    public async Task<T> PostAsync<T>(string endpoint, object data)
    {
        return await PostAsync<T>(endpoint, null);
    }

    public async Task<T> PostAsync<T>(string endpoint, object data, params string[] parameters)
    {
        T result = default(T);

        try
        {
            var json = await StringifyAsync(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(UrlBuilder(endpoint, parameters), content);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            result = await ToObjectAsync<T>(responseContent);
        }
        catch (HttpRequestException httpRequestException)
        {
        }
        catch (Exception exception)
        {
        }

        return result;
    }

    public async Task<T> PutAsync<T>(string endpoint, object data)
    {
        return await PutAsync<T>(endpoint, null);
    }

    public async Task<T> PutAsync<T>(string endpoint, object data, params string[] parameters)
    {
        T result = default(T);
        try
        {
            var json = JsonConvert.SerializeObject(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(UrlBuilder(endpoint, parameters), content);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            result = await ToObjectAsync<T>(responseContent);
        }
        catch (HttpRequestException httpRequestException)
        {
        }
        catch (Exception exception)
        {
        }

        return result;
    }

    public async Task<T> DeleteAsync<T>(string endpoint)
    {
        return await DeleteAsync<T>(endpoint, null);
    }

    public async Task<T> DeleteAsync<T>(string endpoint, params string[] parameters)
    {
        T result = default(T);
        try
        {
            var response = await _httpClient.DeleteAsync(UrlBuilder(endpoint, parameters));
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            result = await ToObjectAsync<T>(responseContent);
        }
        catch (HttpRequestException httpRequestException)
        {
        }
        catch (Exception exception)
        {
        }

        return result;
    }
}