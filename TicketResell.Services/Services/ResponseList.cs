using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Services.Services
{
    public class ResponseList
    {
        public static ResponseModel AggregateResponses(IEnumerable<ResponseModel> responses, string message)
        {
            int index = 1;
            foreach (var response in responses)
            {
                response.Id = index;
                index++;
            }

            var firstError = responses.FirstOrDefault(r => r.StatusCode != 200);
            if (firstError != null)
            {
                return firstError;
            }

            return ResponseModel.Success(message, responses.ToList());
        }
    }
}
