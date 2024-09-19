using System;
using ABI.Microsoft.UI.Xaml.Controls;
using CommunityToolkit.Mvvm.ComponentModel;

namespace App.Contracts.Services
{
    public interface IPageService
    {
        Type GetPageType(string key);
    }
}