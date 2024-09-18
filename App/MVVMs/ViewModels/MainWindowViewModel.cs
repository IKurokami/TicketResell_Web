using System;
using CommunityToolkit.Mvvm.ComponentModel;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Animation;

namespace App.MVVMs.ViewModels
{
    public partial class MainWindowViewModel : ObservableObject
    {
        public MainWindowViewModel()
        {
        }


        private Grid? MainGrid { get; set; }
        private Grid? RootFrameGrid { get; set; }
        private Frame? RootFrame { get; set; }
        private Frame? OverlayFrame { get; set; }

        public void NavigateRootFrame(Type type)
        {
            RootFrame?.Navigate(type, null, new ContinuumNavigationTransitionInfo());
        }

        public void NavigateOverlayFrame(Type type)
        {
            OverlayFrame?.Navigate(type, null, new ContinuumNavigationTransitionInfo());
        }
    }
}