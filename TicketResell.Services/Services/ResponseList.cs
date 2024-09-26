using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Services.Services
{
    public class ResponseList
    {
        public static ResponseModel AggregateResponses(IEnumerable<ResponseModel> responses)
        {
            var firstError = responses.FirstOrDefault(r => r.StatusCode != 200);
            if (firstError != null)
            {
                return firstError;
            }

            return ResponseModel.Success("All operations succeeded.", responses.ToList(), nameof(ResponseList), nameof(AggregateResponses));
        }
    }
}