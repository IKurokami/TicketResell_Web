using TicketResell.Repositories.Core.Dtos.Cart;
using TicketResell.Services.Services.Carts;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(string userId)
        {
            return ResponseParser.Result(await _cartService.GetCart(userId));
        }

        [HttpGet("items/{userId}")]
        public async Task<IActionResult> GetCartItems(string userId)
        {
            return ResponseParser.Result(await _cartService.GetCartItems(userId));
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDto cartItem)
        {
            return ResponseParser.Result(await _cartService.AddToCart(cartItem));
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCartItem([FromBody] CartItemDto cartItem)
        {
            return ResponseParser.Result(await _cartService.UpdateCartItem(cartItem));
        }
        
        [HttpDelete("remove/{userId}/{ticketId}")]
        public async Task<IActionResult> RemoveFromCart(string userId, string ticketId)
        {
            return ResponseParser.Result(await _cartService.RemoveFromCart(userId, ticketId));
        }

        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(string userId)
        {
            return ResponseParser.Result(await _cartService.ClearCart(userId));
        }

        [HttpGet("total/{userId}")]
        public async Task<IActionResult> GetCartTotal(string userId)
        {
            return ResponseParser.Result(await _cartService.GetCartTotal(userId));
        }
        
        [HttpPost("createOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            return ResponseParser.Result(await _cartService.CreateOrderFromSelectedItems(createOrderDto.UserId, createOrderDto.SelectedTicketIds));
        }
    }
}