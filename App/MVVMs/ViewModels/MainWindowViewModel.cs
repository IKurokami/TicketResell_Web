using System;
using App.Contracts.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Animation;

namespace App.MVVMs.ViewModels
{
    public partial class MainWindowViewModel : ObservableRecipient
    {
        public MainWindowViewModel()
        {
        }

        public Grid? MainGrid { get; set; }
        public Grid? RootFrameGrid { get; set; }
        public Frame? RootFrame { get; set; }
        public Frame? OverlayFrame { get; set; }
        public DispatcherQueue? TheDispatcherQueue { get; set; }
        public void NavigateRootFrame(Type type)
        {
            RootFrame?.Navigate(type, null, new ContinuumNavigationTransitionInfo());
        }

        public void NavigateOverlayFrame(Type type)
        {
            OverlayFrame?.Navigate(type, null, new ContinuumNavigationTransitionInfo());
        }

        public void NavigateRootGrid(UIElement content)
        {
            RootFrameGrid?.Children.Clear();
            RootFrameGrid?.Children.Add(content);
        }
    }
}