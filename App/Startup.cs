using System;
using App.ApiRequest;
using App.Contracts.Services;
using App.MVVMs.ViewModels;
using App.MVVMs.Views.Home;
using App.MVVMs.Views.Login;
using App.MVVMs.Views.Setting;
using App.Services;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.UI.Xaml.Media.Animation;
using TicketResell.Services.Services;

namespace App;

public static class Startup
{
    public static IServiceCollection InstallServices(this IServiceCollection services, IConfigurationRoot configuration)
    {
        //Http
        var httpBuilder = services.AddHttpClient<IApiRepository, ApiRepository>(configureClient: static client =>
        {
            client.BaseAddress = new(Configuration.APIUrl);
        }); 
        httpBuilder.SetHandlerLifetime(TimeSpan.FromMinutes(1));
        httpBuilder.AddStandardResilienceHandler();
            
        //Request
        services.AddSingleton<IOrderService, OrderRequest>();
        services.AddSingleton<IAuthenticationService, AuthenticationRequest>();
        services.AddSingleton<ITicketRequest, TicketRequest>();
            
        //ViewModels
        services.AddSingleton<LoginViewModel>();
        services.AddSingleton<ShellViewModel>();
        services.AddSingleton<HomeViewModel>();
        services.AddSingleton<DashBoardViewModel>();
        services.AddTransient<TicketDetailViewModel>();
        services.AddSingleton<MainWindowViewModel>();
        services.AddSingleton<SettingViewModel>();
            
        //MainWindow
        services.AddSingleton<MainWindow>();

        //Setting Services
        services.AddSingleton<ILocalSettingsService, LocalSettingsService>();
        services.Configure<LocalSettingsOptions>(configuration.GetSection(nameof(LocalSettingsOptions)));

        //Services
        services.AddSingleton<IThemeSelectorService, ThemeSelectorService>();
        services.AddSingleton<IPageService, PageService>();
        services.AddSingleton<INavigationService, NavigationService>();
        services.AddSingleton<INavigationViewService, NavigationViewService>();
        services.AddSingleton<IFileServices, FileService>();

        //TransitionInfo
        services.AddSingleton<ContinuumNavigationTransitionInfo>();
        services.AddSingleton<DrillInNavigationTransitionInfo>();
            
        return services;
    }

    public static void InstallFrame()
    {
        var pageService = Ioc.Default.GetService<IPageService>() as PageService;

        pageService?.Configure<LoginViewModel, LoginPage>();
        pageService?.Configure<ShellViewModel, ShellPage>();
        pageService?.Configure<HomeViewModel, HomePage>();
        pageService?.Configure<DashBoardViewModel, DashBoardPage>();
        pageService?.Configure<SettingViewModel, SettingPage>();
    }
}

public class LocalSettingsOptions
{
    public string? ApplicationDataFolder { get; set; }
    public string? LocalSettingsFile { get; set; }
}