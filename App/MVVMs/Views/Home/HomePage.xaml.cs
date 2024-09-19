using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using App.MVVMs.ViewModels;
using App.MVVMs.Views.Detail;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.UI.Xaml.Controls;
using WinUICommunity;

namespace App.MVVMs.Views.Home
{
    public sealed partial class HomePage : Page, IDisposable
    {
        private HomeViewModel ViewModel;
        public ObservableCollection<string> SelectedTags { get; set; } = new ObservableCollection<string>();

        public HomePage()
        {
            ViewModel = Ioc.Default.GetService<HomeViewModel>();
            this.InitializeComponent();
            SelectedTags.CollectionChanged += SelectedTags_CollectionChanged;
        }

        private void SelectedTags_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            ViewModel.FindWithTag(SelectedTags);
        }

        private TabViewItem CreateNewTab(Ticket ticket)
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
        }

        private void Rc_OnRefreshRequested(RefreshContainer sender, RefreshRequestedEventArgs args)
        {
            SelectedTags.Clear();
            GC.Collect();
        }

        private void TicketView_OnItemClick(object sender, ItemClickEventArgs e)
        {
            MainTabView.TabItems.Add(CreateNewTab((Ticket)e.ClickedItem));
        }

        public void Dispose()
        {
            ViewModel = null;
            foreach (var tab in MainTabView.TabItems)
            {
                if (tab is TabViewItem tabItem)
                {
                    ((tabItem.Content as Frame)?.GetPageViewModel() as IDisposable)?.Dispose();
                    (tabItem.Content as IDisposable)?.Dispose();
                }
            }
            GC.Collect();
        }
    }
}