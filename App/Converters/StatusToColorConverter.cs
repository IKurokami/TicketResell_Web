using System;
using Microsoft.UI;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Media;

namespace App.Converters;

public class StatusToColorConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is int status)
        {
            switch (status)
            {
                case 1:
                    return new SolidColorBrush(Colors.Green);
                case 2:
                    return new SolidColorBrush(Colors.Red);
                case 3:
                    return new SolidColorBrush(Colors.Orange);
                default:
                    return new SolidColorBrush(Colors.Gray);
            }
        }
        return new SolidColorBrush(Colors.Black);
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}