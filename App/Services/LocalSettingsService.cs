using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Windows.Storage;
using App.Contracts.Services;
using App.Helpers;
using Microsoft.Extensions.Options;

namespace App.Services;

public class LocalSettingsService : ILocalSettingsService
{
    private IDictionary<string, object> _settings;
    private bool _isInitialized;

    private readonly IFileServices _fileService;
    private readonly LocalSettingsOptions _options;

    public LocalSettingsService(IFileServices fileService, IOptions<LocalSettingsOptions> options)
    {
        _fileService = fileService;
        _options = options.Value;

        _settings = new Dictionary<string, object>();
        _localsettingsFile = _options.LocalSettingsFile ?? _defaultLocalSettingsFile;
        _applicationDataFolder = Path.Combine(_localApplicationData,
            _options.ApplicationDataFolder ?? _defaultApplicationDataFolder);
    }

    public async Task<T?> ReadSettingAsync<T>(string key)
    {
        if (RuntimeHelper.IsMSIX)
        {
            if (ApplicationData.Current.LocalSettings.Values.TryGetValue(key, out var obj))
            {
                return await JsonHelper.ToObjectAsync<T>((string)obj);
            }
        }
        else
        {
            await InitializeAsync();

            if (_settings.TryGetValue(key, out var obj))
            {
                return await JsonHelper.ToObjectAsync<T>((string)obj);
            }
        }

        return default;
    }

    public async Task SaveSettingAsync<T>(string key, T value)
    {
        if (RuntimeHelper.IsMSIX)
        {
            ApplicationData.Current.LocalSettings.Values[key] = await JsonHelper.StringifyAsync(value);
        }
        else
        {
            await InitializeAsync();

            _settings[key] = await JsonHelper.StringifyAsync(value);

            await Task.Run(() => _fileService.Save(_applicationDataFolder, _localsettingsFile, _settings));
        }
    }

    private async Task InitializeAsync()
    {
        if (!_isInitialized)
        {
            _settings = await Task.Run(() =>
                            _fileService.Read<IDictionary<string, object>>(_applicationDataFolder,
                                _localsettingsFile)) ??
                        new Dictionary<string, object>();

            _isInitialized = true;
        }
    }

    private const string _defaultApplicationDataFolder = "TicketResell/ApplicationData";
    private const string _defaultLocalSettingsFile = "TicketResellConfig.json";

    private readonly string _localApplicationData =
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

    private readonly string _applicationDataFolder;
    private readonly string _localsettingsFile;
}