using CommunityToolkit.Mvvm.ComponentModel;
using TicketResell.Services.Services;

namespace App.MVVMs.ViewModels;

public partial class LoginViewModel : ObservableRecipient
{
    IAuthenticationService _authenticationService;
    public LoginViewModel(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }
}