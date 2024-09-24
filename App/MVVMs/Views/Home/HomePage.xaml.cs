using System;
using System.Collections.ObjectModel;
using App.MVVMs.ViewModels;
using App.MVVMs.Views.Detail;
using Backend.Core.Dtos;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.UI.Xaml.Controls;
using WinUICommunity;

namespace App.MVVMs.Views.Home
{
    public sealed partial class HomePage : Page
    {
        private HomeViewModel? ViewModel;
        public ObservableCollection<string> SelectedTags { get; set; } = new ObservableCollection<string>();
        
        public HomePage()
        {
            ViewModel = Ioc.Default.GetService<HomeViewModel>();
            this.InitializeComponent();
            NavigationCacheMode = Microsoft.UI.Xaml.Navigation.NavigationCacheMode.Enabled;

            SelectedTags.CollectionChanged += SelectedTags_CollectionChanged!;
        }

        private void SelectedTags_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            ViewModel?.FindWithTag(SelectedTags);
        }

        private TabViewItem CreateNewTab(TickerReadDto ticket)
        {
            var ticketViewModel = new TicketDetailViewModel();
            ticketViewModel.Ticket = ticket;

            TabViewItem newItem = new TabViewItem();
            newItem.IconSource = new Microsoft.UI.Xaml.Controls.SymbolIconSource() { Symbol = Symbol.Document };
            newItem.Header = ticket.Name;

            newItem.Content = new TicketDetail(ticketViewModel);

            return newItem;
        }

        private void TabView_TabCloseRequested(TabView sender, TabViewTabCloseRequestedEventArgs args)
        {
            (args.Tab.Content as TicketDetail)?.ViewModel.Dispose();
            args.Tab.Content = null;
            sender.TabItems.Remove(args.Tab);

            GC.Collect();
            GC.WaitForPendingFinalizers();
        }

        private void Rc_OnRefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
        {
            ViewModel!.RefreshCompletionDeferral = args.GetDeferral();
            ViewModel?.ReloadData();
            SelectedTags.Clear();

            GC.Collect();
            GC.WaitForPendingFinalizers();
        }

        private void TicketView_OnItemClick(object sender, ItemClickEventArgs e)
        {
            MainTabView.TabItems.Add(CreateNewTab((TickerReadDto)e.ClickedItem));
        }
    }
}