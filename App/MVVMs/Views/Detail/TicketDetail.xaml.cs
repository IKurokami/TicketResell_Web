using System;
using App.MVVMs.ViewModels;
using Microsoft.UI.Xaml.Controls;

namespace App.MVVMs.Views.Detail
{
    public sealed partial class TicketDetail : Page, IDisposable
    {
        public TicketDetailViewModel ViewModel { get; set; }

        public TicketDetail(TicketDetailViewModel viewModel)
        {
            ViewModel = viewModel;
            this.InitializeComponent();
            NavigationCacheMode = Microsoft.UI.Xaml.Navigation.NavigationCacheMode.Disabled;
        }

        public void Dispose()
        {
            ViewModel = null;
        }
    }
}