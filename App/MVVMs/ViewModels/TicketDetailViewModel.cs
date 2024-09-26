using System;
using App.Contracts.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using Windows.Graphics.Printing.PrintTicket;
using Api.Core.Dtos;

namespace App.MVVMs.ViewModels
{
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
}