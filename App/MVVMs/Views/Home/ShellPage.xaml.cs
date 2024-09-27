using App.Contracts.Services;
using App.MVVMs.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using Windows.System;
using App.Helpers;
using CommunityToolkit.Labs.WinUI;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.UI.Xaml.Media;

namespace App.MVVMs.Views.Home
{
    public sealed partial class ShellPage : Page
    {
        public ShellViewModel? ViewModel { get; }

        public ShellPage()
        {
            ViewModel = Ioc.Default.GetService<ShellViewModel>();
            this.InitializeComponent();
            NavigationCacheMode = Microsoft.UI.Xaml.Navigation.NavigationCacheMode.Disabled;

            if (ViewModel != null)
            {
                ViewModel.NavigationService.Frame = NavigationFrame;
                ViewModel.NavigationViewService.Initialize(NavigationViewControl);
            }
        }

        private void OnLoaded(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
        {
            NavigationViewControl.SelectedItem = HomeItem;
            ViewModel?.NavigationService.NavigateTo(NavigationHelper.GetNavigateTo(HomeItem));
            TitleBarHelper.UpdateTitleBar(RequestedTheme);

            KeyboardAccelerators.Add(BuildKeyboardAccelerator(VirtualKey.Left, VirtualKeyModifiers.Menu));
            KeyboardAccelerators.Add(BuildKeyboardAccelerator(VirtualKey.GoBack));
        }

        private static KeyboardAccelerator BuildKeyboardAccelerator(VirtualKey key,
            VirtualKeyModifiers? modifiers = null)
        {
            var keyboardAccelerator = new KeyboardAccelerator() { Key = key };

            if (modifiers.HasValue)
            {
                keyboardAccelerator.Modifiers = modifiers.Value;
            }

            keyboardAccelerator.Invoked += OnKeyboardAcceleratorInvoked;

            return keyboardAccelerator;
        }

        private static void OnKeyboardAcceleratorInvoked(KeyboardAccelerator sender,
            KeyboardAcceleratorInvokedEventArgs args)
        {
            var navigationService = Ioc.Default.GetService<INavigationService>();

            var result = navigationService.GoBack();

            args.Handled = result;
        }

        private void NavigationViewControl_OnItemInvoked(NavigationView sender, NavigationViewItemInvokedEventArgs args)
        {
            if (args.IsSettingsInvoked)
            {
                ViewModel?.NavigationService.NavigateTo("App.MVVMs.ViewModels.SettingViewModel");
            }
        }
    }
}