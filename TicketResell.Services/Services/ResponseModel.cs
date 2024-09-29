namespace TicketResell.Services.Services
{
    public class ResponseModel
    {
        public int Id { get; set; } = 1;
        public int StatusCode { get; set; }
        public string? Status { get; set; }
        public string? Message { get; set; }
        public object? Data { get; set; }

        public ResponseModel()
        {
        }

        private ResponseModel(int statusCode, string status, string message, object? data)
        {
            StatusCode = statusCode;
            Status = status;
            Message = message;
            Data = data;
        }

        public static ResponseModel Success(string message, object? data)
        {
            return new ResponseModel(200, "Success", message, data);
        }
        public static ResponseModel Success(string message)
        {
            return new ResponseModel(200, "Success", message, null);
        }


        public static ResponseModel Error(string message)
        {
            return new ResponseModel(500, "Error", message, null);
        }

        public static ResponseModel NotFound(string message)
        {
            return new ResponseModel(404, "Not Found", message, null);
        }


        public static ResponseModel BadRequest(string message)
        {
            return new ResponseModel(400, "Bad Request", message, null);
        }

        public static ResponseModel BadRequest(string message, object? data)
        {
            return new ResponseModel(400, "Bad Request", message, data);
        }
    }
}