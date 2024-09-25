using App.MVVMs.ViewModels;
using App.MVVMs.Views.Login;
using CommunityToolkit.Common;
using CommunityToolkit.Mvvm.DependencyInjection;

namespace App
{
    public sealed partial class MainWindow
    {
        private readonly MainWindowViewModel? ViewModel;

        public MainWindow(MainWindowViewModel viewModel)
        {
            ViewModel = viewModel;
            this.InitializeComponent();

            ViewModel.MainGrid = MainGrid;
            ViewModel.RootFrame = rootFrame;
            ViewModel.OverlayFrame = overlayFrame;
            ViewModel.TheDispatcherQueue = Microsoft.UI.Dispatching.DispatcherQueue.GetForCurrentThread();
           
            rootFrame.Navigate(typeof(LoginPage));

            Ioc.Default.GetService<HomeViewModel>();
        }
    }
}