using System;
using App.MVVMs.ViewModels;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace App.MVVMs.Views.Setting
{
    public sealed partial class SettingPage : Page
    {
        private SettingViewModel? ViewModel;
        public SettingPage()
        {
            this.InitializeComponent();
            NavigationCacheMode = Microsoft.UI.Xaml.Navigation.NavigationCacheMode.Enabled;
            ViewModel = Ioc.Default.GetService<SettingViewModel>();
        }

        private void ThemeSelectionChange(object sender, SelectionChangedEventArgs e)
        {
            ElementTheme theme = ThemeBox.SelectedIndex switch
            {
                0 => ElementTheme.Default, 
                1 => ElementTheme.Light,
                2 => ElementTheme.Dark,
                _ => ElementTheme.Default
            };

            ViewModel?.ChangeTheme(theme);
        }

        private void ThemeLoaded(object sender, RoutedEventArgs e)
        {
            ThemeBox.SelectedIndex = (int)ViewModel.ThemeSelectorService.Theme;
        }
    }
}
