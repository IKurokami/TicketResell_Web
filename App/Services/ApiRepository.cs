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

    public ApiRepository(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    private string UrlBuilder(string endpoint, params string[] parameters)
    {
        string url = endpoint;
        if (parameters.Length > 0)
        {
            url += "/" + string.Join("/", parameters);
        }

        return _httpClient.BaseAddress + "/" + url;
    }

    private async Task<T?> HttpRequestAsync<T>(string endpoint, HttpMethod method, object? data,
        params string[] parameters)
    {
        T? result = default(T);
        try
        {
            HttpResponseMessage? response = null;

            string json;
            StringContent? body = null;

            if (data != null)
            {
                json = await StringifyAsync(data);
                body = new StringContent(json, Encoding.UTF8, "application/json");
            }

            if (method == HttpMethod.Get)
            {
                var url = UrlBuilder(endpoint, parameters);
                response = await _httpClient.GetAsync(url);
            }
            else if (method == HttpMethod.Post)
            {
                response = await _httpClient.PostAsync(UrlBuilder(endpoint, parameters), body);
            }
            else if (method == HttpMethod.Put)
            {
                response = await _httpClient.PutAsync(UrlBuilder(endpoint, parameters), body);
            }
            else if (method == HttpMethod.Delete)
            {
                response = await _httpClient.DeleteAsync(UrlBuilder(endpoint, parameters));
            }
            else
            {
                response = await _httpClient.PostAsync(UrlBuilder(endpoint, parameters), body);
            }

            if (response != null)
            {
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                result = await ToObjectAsync<T>(content);
            }
        }
        catch (HttpRequestException httpRequestException)
        {
        }
        catch (Exception exception)
        {
            // ignored
        }

        return result;
    }

    public async Task<T?> GetAsync<T>(string endpoint)
    {
        return await GetAsync<T>(endpoint, null);
    }

    public async Task<T?> GetAsync<T>(string endpoint, params string[] parameters)
    {
        return await HttpRequestAsync<T>(endpoint, HttpMethod.Get, null, parameters);
    }

    public async Task<T> PostAsync<T>(string endpoint, object data)
    {
        return await PostAsync<T>(endpoint, null);
    }

    public async Task<T?> PostAsync<T>(string endpoint, object? data, params string[] parameters)
    {
        return await HttpRequestAsync<T>(endpoint, HttpMethod.Post, data, parameters);

    }

    public async Task<T?> PutAsync<T>(string endpoint, object? data)
    {
        return await PutAsync<T>(endpoint, null);
    }

    public async Task<T?> PutAsync<T>(string endpoint, object data, params string[] parameters)
    {
        return await HttpRequestAsync<T>(endpoint, HttpMethod.Put, data, parameters);

    }

    public async Task<T?> DeleteAsync<T>(string endpoint)
    {
        return await DeleteAsync<T>(endpoint, null);
    }

    public async Task<T?> DeleteAsync<T>(string endpoint, params string[] parameters)
    {
        return await HttpRequestAsync<T>(endpoint, HttpMethod.Delete, null, parameters);

    }
}