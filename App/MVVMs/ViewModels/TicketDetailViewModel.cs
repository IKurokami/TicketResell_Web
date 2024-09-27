using System;
using CommunityToolkit.Mvvm.ComponentModel;
using Repositories.Core.Dtos.Ticket;

namespace App.MVVMs.ViewModels;

public partial class TicketDetailViewModel : ObservableRecipient, IDisposable
{
    public TickerReadDto Ticket { get; set; }

    public TicketDetailViewModel()
    {
    }

    public void Dispose()
    {
        Ticket = null;
        GC.Collect();
    }
}