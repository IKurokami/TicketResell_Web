using System;
using Api.Core.Dtos;
using Microsoft.UI.Xaml.Data;

namespace App.Converters;

public class EventInfoConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is TickerReadDto ticket)
        {
            return $"Event: {ticket.Name} - {ticket.StartDate:MMM dd, yyyy HH:mm}";
        }

        return string.Empty;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}