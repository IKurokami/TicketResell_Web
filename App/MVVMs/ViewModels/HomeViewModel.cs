using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Windows.Foundation;
using App.ApiRequest;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.DependencyInjection;
using WinUICommunity;
using Repositories.Core.Dtos.Ticket;

namespace App.MVVMs.ViewModels;

public partial class HomeViewModel : ObservableRecipient
{
    public ObservableCollection<TickerReadDto> Tickets { get; } = new();
    public ObservableCollection<Category> Categories { get; } = new();

    private List<TickerReadDto> _ticketsRead = new();
    private ITicketRequest _ticketRequest;
    public Deferral? RefreshCompletionDeferral
    {
        get;
        set;
    }

    public HomeViewModel(ITicketRequest ticketRequest)
    {
        _ticketRequest = ticketRequest;
        ReloadData();
    }

    public async void ReloadData()
    {
        var query = await _ticketRequest.GetAllTicketsAsync();
        if (query != null && query.Any())
        {
            _ticketsRead.Clear();
            _ticketsRead.AddRange(query);
        }

        Tickets.Clear();

        var vm = Ioc.Default.GetService<MainWindowViewModel>()!;
        foreach (var ticket in _ticketsRead)
        {
            if (vm.TheDispatcherQueue != null)
                vm.TheDispatcherQueue.TryEnqueue(() => { Tickets?.Add(ticket); });
        }

        GC.Collect();

        if (this.RefreshCompletionDeferral == null) return;

        this.RefreshCompletionDeferral.Complete();
        this.RefreshCompletionDeferral.Dispose();
        this.RefreshCompletionDeferral = null;
    }

    public void FindWithTag(IList<string> tags)
    {
        Tickets.Clear();
        Tickets.AddRange(_ticketsRead);
        foreach (var tag in tags)
        {
            var removed = _ticketsRead.Where(t => t.Name == null || !t.Name.Contains(tag, StringComparison.CurrentCultureIgnoreCase)).ToList();

            foreach (var t in removed)
                Tickets.Remove(t);
        }
    }
}