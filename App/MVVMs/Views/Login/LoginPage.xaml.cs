using App.MVVMs.ViewModels;
using App.MVVMs.Views.Home;
using CommunityToolkit.Labs.WinUI;
using CommunityToolkit.Mvvm.DependencyInjection;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using WinUICommunity;

namespace App.MVVMs.Views.Login
{
    public sealed partial class LoginPage : Page
    {
        public readonly LoginViewModel? ViewModel;

        public LoginPage()
        {
            ViewModel = Ioc.Default.GetService<LoginViewModel>();
            
            this.InitializeComponent();
            NavigationCacheMode = Microsoft.UI.Xaml.Navigation.NavigationCacheMode.Disabled;

        }

        private void Register_Click(object sender, RoutedEventArgs e)
        {
        }

        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            var result = await CredentialHelper.PickCredential("Register", "Register for this username and password");
            if (string.IsNullOrEmpty(result.CredentialUserName) || string.IsNullOrEmpty(result.CredentialPassword))
                return;
            var mainViewModel = Ioc.Default.GetService<MainWindowViewModel>();
            mainViewModel?.TheDispatcherQueue?.TryEnqueue(() =>
            {
                mainViewModel.NavigateRootFrame(typeof(ShellPage));
            });
        }

        private void UsernameBox_OnKeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (sender is TextBox textBox)
            {
                if (textBox.Tag is string tag)
                {
                    if ("UsernameBox".Equals(tag))
                    {
                        if (e.Key == Windows.System.VirtualKey.Enter)
                        {
                            RegisterExpand();
                        }
                    }
                }
            }
        }

        private void RegisterExpand() => _ = new StartTransitionAction()
        {
            Transition = (TransitionHelper)Resources["MyTransitionHelper"],
            Source = RegisterPanel,
            Target = RegiserFull
        }.Execute(null, parameter: null);
    }
}