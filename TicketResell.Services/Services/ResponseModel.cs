using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicketResell.Services.Services
{
    public class ResponseModel
    {
        public string ServiceName { get; set; } = null!;
        public string FunctionName { get; set; } = null!;
        public int StatusCode { get; set; }
        public string Status { get; set; } = null!;
        public string Message { get; set; } = null!;
        public object? Data { get; set; }


        public ResponseModel()
        {
        }

        private ResponseModel(int statusCode, string status, string message, object? data, string serviceName, string functionName)
        {
            ServiceName = serviceName;
            FunctionName = functionName;
            StatusCode = statusCode;
            Status = status;
            Message = message;
            Data = data;
        }

        public static ResponseModel Success(string message, object? data, string serviceName, string functionName)
        {
            return new ResponseModel(200, "Success", message, data, serviceName, functionName);
        }
        public static ResponseModel Success(string message, string serviceName, string functionName)
        {
            return new ResponseModel(200, "Success", message, null, serviceName, functionName);
        }


        public static ResponseModel Error(string message, string serviceName, string functionName)
        {
            return new ResponseModel(500, "Error", message, null, serviceName, functionName);
        }

        public static ResponseModel NotFound(string message, string serviceName, string functionName)
        {
            return new ResponseModel(404, "Not Found", message, null, serviceName, functionName);
        }


        public static ResponseModel BadRequest(string message, string serviceName, string functionName)
        {
            return new ResponseModel(400, "Bad Request", message, null, serviceName, functionName);
        }

        public static ResponseModel BadRequest(string message, object? data, string serviceName, string functionName)
        {
            return new ResponseModel(400, "Bad Request", message, data, serviceName, functionName);
        }
    }
}