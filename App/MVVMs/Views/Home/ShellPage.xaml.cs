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
        public ShellViewModel ViewModel { get; }

        public ShellPage()
        {
            ViewModel = Ioc.Default.GetService<ShellViewModel>();
            this.InitializeComponent();
            App.MainWindow.AppWindow.TitleBar.ExtendsContentIntoTitleBar = true;
            App.MainWindow.AppWindow.TitleBar.ButtonBackgroundColor = Microsoft.UI.Colors.Transparent;

            ViewModel.NavigationService.Frame = NavigationFrame;
            ViewModel.NavigationViewService.Initialize(NavigationViewControl);
            App.MainWindow.SetTitleBar(AppTitleBar);
            App.MainWindow.Activated += MainWindow_Activated;
            AppTitleBarText.Text = "TicketResell";
        }

        private void OnLoaded(object sender, Microsoft.UI.Xaml.RoutedEventArgs e)
        {
            NavigationViewControl.SelectedItem = HomeItem;
            ViewModel.NavigationService.NavigateTo(NavigationHelper.GetNavigateTo(HomeItem));
            Helpers.TitleBarHelper.UpdateTitleBar(RequestedTheme);

            KeyboardAccelerators.Add(BuildKeyboardAccelerator(VirtualKey.Left, VirtualKeyModifiers.Menu));
            KeyboardAccelerators.Add(BuildKeyboardAccelerator(VirtualKey.GoBack));
        }

        private void MainWindow_Activated(object sender, WindowActivatedEventArgs args)
        {
            App.AppTitlebar = AppTitleBarText as UIElement;
        }

        private void NavigationViewControl_DisplayModeChanged(NavigationView sender,
            NavigationViewDisplayModeChangedEventArgs args)
        {
            AppTitleBar.Margin = new Thickness()
            {
                Left = sender.CompactPaneLength * (sender.DisplayMode == NavigationViewDisplayMode.Minimal ? 2 : 1),
                Top = AppTitleBar.Margin.Top,
                Right = AppTitleBar.Margin.Right,
                Bottom = AppTitleBar.Margin.Bottom
            };
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
                var backgroundBrush = (SolidColorBrush)Application.Current.Resources["SystemControlBackgroundChromeMediumBrush"];
                SettingButtonBackGround.Background = backgroundBrush;
                var startTransitionAction = new StartTransitionAction();
                startTransitionAction.Source = HomeView;
                startTransitionAction.Target = SettingViewCollapsed;
                startTransitionAction.Transition = (TransitionHelper)Resources["MyTransitionHelper"];

                // Execute the transition
                startTransitionAction.Execute(null, null);
            }
        }
    }
}