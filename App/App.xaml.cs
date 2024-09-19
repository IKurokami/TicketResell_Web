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
            MainWindow = Ioc.Default.GetService<MainWindow>();
            MainWindow.Activate();
        }

        public static WindowEx MainWindow { get; set; }

        public static UIElement? AppTitlebar { get; set; }
    }
}