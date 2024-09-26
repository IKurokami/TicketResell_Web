using System;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.UI.Xaml;
using WinUICommunity;

namespace App
{
    public partial class App : Application
    {
        public App()
        {
            this.InitializeComponent();
            UnhandledException += App_UnhandledException;
            
            Configuration.APIUrl = "http://localhost:5296/api";
            Ioc.Default.ConfigureServices(new ServiceCollection()
                .InstallServices().BuildServiceProvider());
            
            Startup.InstallFrame();
        }

        private void App_UnhandledException(object sender, Microsoft.UI.Xaml.UnhandledExceptionEventArgs e)
        {
            //TODO: Add logging
        }

        protected override void OnLaunched(Microsoft.UI.Xaml.LaunchActivatedEventArgs args)
        {
            MainWindow = Ioc.Default.GetService<MainWindow>()!;
            MainWindow.Activate();
            MainWindow.AppWindow.TitleBar.ExtendsContentIntoTitleBar = true;
            MainWindow.AppWindow.TitleBar.ButtonBackgroundColor = Microsoft.UI.Colors.Transparent;
        }

        public static WindowEx MainWindow { get; set; }

        public static UIElement? AppTitlebar { get; set; }
    }
}