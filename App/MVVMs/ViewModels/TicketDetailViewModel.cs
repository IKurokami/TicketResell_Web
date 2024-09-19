using System;
using App.Contracts.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using Windows.Graphics.Printing.PrintTicket;

namespace App.MVVMs.ViewModels
{
    public partial class TicketDetailViewModel : ObservableRecipient, IDisposable
    {
        public Ticket Ticket { get; set; }

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