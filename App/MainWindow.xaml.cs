using App.MVVMs.Views.Login;
using Microsoft.UI.Xaml.Media.Animation;

namespace App
{
    public sealed partial class MainWindow
    {
        public MainWindow()
        {
            this.InitializeComponent();
        }

        private void Button_Click(object sender
            , Microsoft.UI.Xaml.RoutedEventArgs e)
        {
            rootFrame.Navigate(typeof(LoginPage), null, new DrillInNavigationTransitionInfo());
        }
    }
}