using System;
using App.Contracts.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.UI.Xaml;

namespace App.MVVMs.ViewModels;

public partial class SettingViewModel : ObservableRecipient
{
    public IThemeSelectorService ThemeSelectorService;

    public SettingViewModel(IThemeSelectorService themeSelectorService)
    {
        ThemeSelectorService = themeSelectorService;
    }

    [RelayCommand]
    public void ChangeTheme(object? themeName)
    {
        if (themeName != null)
        {
            if (themeName is string name)
            {
                if (Enum.TryParse(name, true, out ElementTheme theme))
                {
                    ThemeSelectorService.SetThemeAsync(theme);
                }
            }
            else if (themeName is ElementTheme elementTheme)
            {
                {
                    ThemeSelectorService.SetThemeAsync(elementTheme);
                }
            }
        }
    }
}