using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Repositories.Logger
{
    public interface IAppLogger
    {
        void LogInformation(string message);
        void LogError(string message);
    }
}