using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using WinUICommunity;

namespace App.MVVMs.Views.Login
{
    public sealed partial class LoginPage : Page
    {
        public LoginPage()
        {
            this.InitializeComponent();
        }

        private async void Register_Click(object sender, RoutedEventArgs e)
        {
            RegisterError.Text = "";
            var result = await CredentialHelper.PickCredential("Register", "Please enter Username and Passoword");
            if (string.IsNullOrEmpty(result.CredentialUserName) || string.IsNullOrEmpty(result.CredentialPassword))
            {
                RegisterError.Text = "Register process canceled!";
                return;
            }

            RegisterError.Text = "Nice try";
        }

        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            LoginError.Text = "";
            var result = await CredentialHelper.PickCredential("Login", "Please enter Username and Passoword");
            if (string.IsNullOrEmpty(result.CredentialUserName) || string.IsNullOrEmpty(result.CredentialPassword))
            {
                LoginError.Text = "Login Failed!";
                return;
            }

            LoginError.Text = "Nice try";
        }
    }
}