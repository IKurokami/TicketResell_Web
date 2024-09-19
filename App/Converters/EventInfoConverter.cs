using System;
using Microsoft.UI.Xaml.Data;

namespace App.Converters;

public class EventInfoConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is Ticket ticket)
        {
            return $"Event: {ticket.EventName} - {ticket.EventDate:MMM dd, yyyy HH:mm}";
        }

        return string.Empty;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}