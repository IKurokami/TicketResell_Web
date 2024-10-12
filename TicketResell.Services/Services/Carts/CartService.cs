using AutoMapper;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using Repositories.Core.Validators;
using TicketResell.Repositories.Core.Dtos.Cart;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Carts;

namespace TicketResell.Services.Services
{
    public class CartService : ICartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IValidatorFactory _validatorFactory;

        public CartService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _validatorFactory = validatorFactory;
        }

        public async Task<ResponseModel> GetCart(string userId)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return ResponseModel.NotFound($"Cart not found for user: {userId}");
            }

            var cartDto = _mapper.Map<CartDto>(cart);
            return ResponseModel.Success($"Successfully retrieved cart for user: {userId}", cartDto);
        }

        public async Task<ResponseModel> AddToCart(CartItemDto cartItemDto)
        {
            var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(cartItemDto.TicketId);
            if (ticket == null)
            {
                return ResponseModel.NotFound("Ticket not found");
            }

            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(cartItemDto.UserId);
            if (cart == null)
            {
                cart = await _unitOfWork.CartRepository.CreateCartAsync(cartItemDto.UserId);
            }

            var cartItem = new OrderDetail()
            {
                OrderDetailId = "OD" + Guid.NewGuid(),
                OrderId = cart.OrderId,
                TicketId = ticket.TicketId,
                Price = ticket.Cost,
                Quantity = cartItemDto.Quantity,
            };

            var validator = _validatorFactory.GetValidator<OrderDetail>();
            var validationResult = await validator.ValidateAsync(cartItem);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
            }

            await _unitOfWork.CartRepository.AddToCartAsync(cart, cartItem);
            
            return ResponseModel.Success($"Successfully added item to cart for user: {cartItemDto.UserId}");
        }

        public async Task<ResponseModel> UpdateCartItem(CartItemDto cartItemDto)
        {
            var ticket = await _unitOfWork.TicketRepository.GetByIdAsync(cartItemDto.TicketId);
            if (ticket == null)
            {
                return ResponseModel.NotFound("Ticket not found");
            }

            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(cartItemDto.UserId);
            if (cart == null)
            {
                return ResponseModel.NotFound($"Cart not found for user: {cartItemDto.UserId}");
            }

            var cartItem = new OrderDetail()
            {
                OrderDetailId = "OD" + Guid.NewGuid(),
                OrderId = cart.OrderId,
                TicketId = ticket.TicketId,
                Price = ticket.Cost,
                Quantity = cartItemDto.Quantity,
            };

            var validator = _validatorFactory.GetValidator<OrderDetail>();
            var validationResult = await validator.ValidateAsync(cartItem);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
            }

            try
            {
                await _unitOfWork.CartRepository.UpdateCartItemAsync(cart, cartItem);
                return ResponseModel.Success($"Successfully updated cart item: {cartItemDto.TicketId}", cartItem);
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(ex.Message);
            }
        }

        public async Task<ResponseModel> RemoveFromCart(string userId, string ticketId)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return ResponseModel.NotFound($"Cart not found for user: {userId}");
            }

            try
            {
                await _unitOfWork.CartRepository.RemoveFromCartAsync(cart, ticketId);
                return ResponseModel.Success($"Successfully removed item from cart: {ticketId}");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(ex.Message);
            }
        }

        public async Task<ResponseModel> ClearCart(string userId)
        {
            try
            {
                await _unitOfWork.CartRepository.ClearCartAsync(userId);
                return ResponseModel.Success($"Successfully cleared cart for user: {userId}");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(ex.Message);
            }
        }

        public async Task<ResponseModel> GetCartTotal(string userId)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return ResponseModel.NotFound($"Cart not found for user: {userId}");
            }

            var total = cart.OrderDetails.Sum(item => item.Price * item.Quantity);

            return ResponseModel.Success($"Successfully calculated cart total for user: {userId}", total);
        }

        public async Task<ResponseModel> GetCartItems(string userId)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return ResponseModel.NotFound($"Cart not found for user: {userId}");
            }

            var cartItems = _mapper.Map<IEnumerable<OrderDetailDto>>(cart.OrderDetails);
            return ResponseModel.Success($"Successfully retrieved cart items for user: {userId}", cartItems);
        }

        public async Task<ResponseModel> CreateOrderFromSelectedItems(string userId, List<string> selectedTicketIds)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return ResponseModel.NotFound($"Cart not found for user: {userId}");
            }

            var selectedItems = cart.OrderDetails.Where(od => selectedTicketIds.Contains(od.TicketId)).ToList();
            if (!selectedItems.Any())
            {
                return ResponseModel.BadRequest("No selected items found in the cart");
            }

            var order = new Order
            {
                OrderId = "O" + Guid.NewGuid(),
                BuyerId = userId,
                Date = DateTime.UtcNow,
                OrderDetails = selectedItems
            };

            var validator = _validatorFactory.GetValidator<Order>();
            var validationResult = await validator.ValidateAsync(order);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
            }

            await _unitOfWork.OrderRepository.CreateAsync(order);
            foreach (var ticketId in selectedTicketIds)
            {
                await _unitOfWork.CartRepository.RemoveFromCartAsync(cart, ticketId);
            }

            var orderDto = _mapper.Map<OrderDto>(order);
            return ResponseModel.Success("Order created successfully", orderDto);
        }

        public async Task<ResponseModel> Checkout(string userId)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return ResponseModel.NotFound($"Cart not found for user: {userId}");
            }

            if (!cart.OrderDetails.Any())
            {
                return ResponseModel.BadRequest("Cart is empty");
            }

            var order = new Order
            {
                OrderId = "O" + Guid.NewGuid(),
                BuyerId = userId,
                Date = DateTime.UtcNow,
                Status = (int)OrderStatus.Completed,
                OrderDetails = cart.OrderDetails.ToList()
            };

            var validator = _validatorFactory.GetValidator<Order>();
            var validationResult = await validator.ValidateAsync(order);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
            }

            await _unitOfWork.OrderRepository.CreateAsync(order);
            await _unitOfWork.CartRepository.ClearCartAsync(userId);

            var orderDto = _mapper.Map<OrderDto>(order);
            return ResponseModel.Success("Checkout completed successfully", orderDto);
        }
    }
}