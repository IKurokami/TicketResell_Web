using System;
using Microsoft.Extensions.Hosting;
using Microsoft.UI.Xaml;

namespace App
{
    public partial class App : Application
    {
        public IHost Host
        {
            get;
        }

        public static T GetService<T>()
            where T : class
        {
            if ((Current as App)!.Host.Services.GetService(typeof(T)) is not T service)
            {
                throw new ArgumentException($"{typeof(T)} needs to be registered in ConfigureServices within App.xaml.cs.");
            }

            return service;
        }

        public App()
        {
            this.InitializeComponent();
            UnhandledException += App_UnhandledException;

            Host = Microsoft.Extensions.Hosting.Host
                .CreateDefaultBuilder()
                .UseContentRoot(AppContext.BaseDirectory)
                .ConfigureServices((context, services) =>
                {
                }).Build();
        }

        private void App_UnhandledException(object sender, Microsoft.UI.Xaml.UnhandledExceptionEventArgs e)
        {
            //TODO: Add logging
        }

        protected override void OnLaunched(Microsoft.UI.Xaml.LaunchActivatedEventArgs args)
        {
            MainWindow = new MainWindow();
            MainWindow.Activate();
        }

        public WindowEx MainWindow;
    }
}