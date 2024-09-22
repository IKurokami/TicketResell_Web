using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using CommunityToolkit.Mvvm.ComponentModel;

namespace App.MVVMs.ViewModels
{
    public partial class HomeViewModel : ObservableRecipient
    {
        public ObservableCollection<Ticket> tickets { get; } = new ObservableCollection<Ticket>();

        public HomeViewModel()
        {
            ReloadData();
        }

        public void ReloadData()
        {
            tickets.Clear();
            GC.Collect();
        }

        public void FindWithTag(IList<string> tags)
        {
            ReloadData();

            foreach (var tag in tags)
            {
                var removed = tickets.ToList().Where(t => !t.Name.ToLower().Contains(tag.ToLower()));

                foreach (var t in removed)
                    tickets.Remove(t);
            }
        }
    }
}