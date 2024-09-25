using System;
using App.Contracts.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using Windows.Graphics.Printing.PrintTicket;
using Backend.Core.Dtos;

namespace App.MVVMs.ViewModels
{
    public partial class TicketDetailViewModel : ObservableRecipient, IDisposable
    {
        public TickerReadDto? Ticket { get; set; }

        public TicketDetailViewModel(TickerReadDto? ticket)
        {
            Ticket = ticket;
        }

        public void Dispose()
        {
            Ticket = null;
            GC.Collect();
        }
    }
}