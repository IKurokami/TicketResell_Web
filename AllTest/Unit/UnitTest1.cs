using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.Mvc;
using TicketResell.Services.Services;
using TicketResell.Repositories.Core.Dtos.Authentication;
using Repositories.Core.Helper;
using System.Threading.Tasks;
using TicketResell.Repositories.Controllers;
using Api.Controllers;
using Repositories.Core.Dtos.User;

namespace Unit
{
    [TestFixture]
    public class AuthenticationControllerTests
    {
        private Mock<IAuthenticationService> _mockAuthService;
        private AuthenticationController _controller;

        [SetUp]
        public void Setup()
        {
            _mockAuthService = new Mock<IAuthenticationService>();
            var serviceProvider = new Mock<IServiceProvider>();
            serviceProvider.Setup(x => x.GetService(typeof(IAuthenticationService))).Returns(_mockAuthService.Object);
            _controller = new AuthenticationController(_mockAuthService.Object);
        }

        [Test]
        public async Task Login_ValidCredentials_ReturnsOkResult()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Gmail = "user@example.com",
                Password = "password123"
            };

            var loginInfoDto = new LoginInfoDto
            {
                User = new UserReadDto { UserId = "USER1", Gmail = "user@example.com" },
                AccessKey = "sample_access_key"
            };

            _mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
                .ReturnsAsync(ResponseModel.Success("Login successful", loginInfoDto));

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult!.Value, Is.InstanceOf<ResponseModel>());
            var response = okResult.Value as ResponseModel;
            Assert.That(response!.StatusCode, Is.EqualTo(200));
            Assert.That(response.Status, Is.EqualTo("Success"));
            Assert.That(response.Message, Is.EqualTo("Login successful"));
            Assert.That(response.Data, Is.Not.Null);
            Assert.That(response.Data, Is.InstanceOf<LoginInfoDto>());
        }

        [Test]
        public async Task Login_InvalidCredentials_ReturnsBadRequestResult()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Gmail = "user@example.com",
                Password = "wrongpassword"
            };

            _mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
                .ReturnsAsync(ResponseModel.BadRequest("Login failed", "Invalid email or password"));

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
                var badRequestResult = result as BadRequestObjectResult;
                Assert.That(badRequestResult, Is.Not.Null);
                Assert.That(badRequestResult!.Value, Is.InstanceOf<ResponseModel>());
                var response = badRequestResult.Value as ResponseModel;
                Assert.That(response, Is.Not.Null);
                Assert.That(response!.StatusCode, Is.EqualTo(400));
                Assert.That(response.Status, Is.EqualTo("Error"));
                Assert.That(response.Message, Is.EqualTo("Login failed"));
                Assert.That(response.Data, Is.EqualTo("Invalid email or password"));
            });
        }
    }
}