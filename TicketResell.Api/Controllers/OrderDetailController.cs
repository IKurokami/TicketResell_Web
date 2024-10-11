using Repositories.Constants;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Dtos.User;
using TicketResell.Repositories.Helper;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;
        private readonly IServiceProvider _serviceProvider;

        public OrderDetailController(IOrderDetailService orderDetailService, IServiceProvider serviceProvider)
        {
            _orderDetailService = orderDetailService;
            _serviceProvider = serviceProvider;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrderDetail([FromBody] OrderDetailDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to create order details"));

            var userId = HttpContext.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("Cannot create order detail with unknown user"));

            var userService = _serviceProvider.GetRequiredService<IUserService>();
            var user = await userService.GetUserByIdAsync(userId);

            if (user.Data is UserReadDto userReadDto)
            {
                if (userReadDto.Roles.Any(x => RoleHelper.HasEnoughRoleLevel(x.RoleId, UserRole.Buyer)))
                {
                    return ResponseParser.Result(await _orderDetailService.CreateOrderDetail(dto));
                }

                return ResponseParser.Result(ResponseModel.Forbidden("You don't have permission to delete the order"));
            }

            return ResponseParser.Result(ResponseModel.NotFound("User not found in server"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view order details"));

            //TODO: check for order buyerId is authenticated UserId
            
            return ResponseParser.Result(await _orderDetailService.GetOrderDetail(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrderDetails()
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view order details"));

            //TODO: Check for authenticated UserId is a Staff or Admin
            
            return ResponseParser.Result(await _orderDetailService.GetAllOrderDetails());
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetOrderDetailsByBuyerId(string buyerId)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view order details"));

            var userId = HttpContext.GetUserId();
            if (userId != buyerId)
                return ResponseParser.Result(
                    ResponseModel.Forbidden("Access denied: You cannot access order details for this buyer"));
            
            return ResponseParser.Result(await _orderDetailService.GetOrderDetailsByBuyerId(buyerId));
        }

        [HttpGet("seller/{sellerId}")]
        public async Task<IActionResult> GetOrderDetailsBySellerId(string sellerId)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view order details"));

            var userId = HttpContext.GetUserId();
            if (userId != sellerId)
                return ResponseParser.Result(
                    ResponseModel.Forbidden("Access denied: You cannot access order details for this seller"));

            return ResponseParser.Result(await _orderDetailService.GetOrderDetailsBySellerId(sellerId));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrderDetail([FromBody] OrderDetailDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to update order details"));

            var userId = HttpContext.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("Cannot update order detail with unknown user"));
            
            return ResponseParser.Result(await _orderDetailService.UpdateOrderDetail(dto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to delete order details"));

            var userId = HttpContext.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("Cannot delete order detail with unknown user"));
            
            return ResponseParser.Result(await _orderDetailService.DeleteOrderDetail(id));
        }
    }
}