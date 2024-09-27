using System;
using System.Threading.Tasks;
using App.Contracts.Services;
using App.Helpers;
using App.MVVMs.Views.Home;
using App.MVVMs.Views.Login;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Animation;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Services.Services;

namespace App.MVVMs.ViewModels;

public partial class MainWindowViewModel : ObservableRecipient
{
    private const string UserIdKey = "LoginAccessKey";
    private const string AccessKeyKey = "LoginAccessKey";
    
    ILocalSettingsService _localSettingsService;
    IAuthenticationService _authenticationService;
    
    public MainWindowViewModel(ILocalSettingsService localSettingsService, IAuthenticationService authenticationService)
    {
        _localSettingsService = localSettingsService;
        _authenticationService = authenticationService;
    }

    public async void InitializeAsync()
    {
        var userId = await LoadUserId();
        var accessKey = await LoadAccessKey();
        if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(accessKey))
        {
            var respone = await _authenticationService.LoginWithAccessKeyAsync(userId, accessKey);
            if (respone.StatusCode == 200)
            {
                var loginInfo = respone.Data as LoginInfoDto;
                if (loginInfo != null)
                {
                    Configuration.User = loginInfo.User;
                    NavigateRootFrame(typeof(ShellPage));
                    await Task.CompletedTask;
                    return;
                }
            }
        }

        NavigateRootFrame(typeof(LoginPage));
    }
    
    private async Task<string> LoadAccessKey()
    {
        var accessKey = await _localSettingsService.ReadSettingAsync<string>(AccessKeyKey);
        
        return accessKey ?? string.Empty;
    }
    
    private async Task<string> LoadUserId()
    {
        var accessKey = await _localSettingsService.ReadSettingAsync<string>(UserIdKey);
        
        return accessKey ?? string.Empty;
    }

    private async Task SaveDataAsync(string userId, string accessKey)
    {
        await _localSettingsService.SaveSettingAsync(UserIdKey, userId);
        await _localSettingsService.SaveSettingAsync(AccessKeyKey, accessKey);
        await Task.CompletedTask;
    }
    
    public Grid? MainGrid { get; set; }
    public Grid? RootFrameGrid { get; set; }
    public Frame? RootFrame { get; set; }
    public Frame? OverlayFrame { get; set; }
    public DispatcherQueue? TheDispatcherQueue { get; set; }
    public void NavigateRootFrame(Type type)
    {
        RootFrame?.Navigate(type, null, new ContinuumNavigationTransitionInfo());
    }

    public void NavigateOverlayFrame(Type type)
    {
        OverlayFrame?.Navigate(type, null, new ContinuumNavigationTransitionInfo());
    }

    public void NavigateRootGrid(UIElement content)
    {
        RootFrameGrid?.Children.Clear();
        RootFrameGrid?.Children.Add(content);
    }
}