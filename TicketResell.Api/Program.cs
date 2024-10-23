using Api.Utils;
using DotNetEnv;

using FluentValidation;
using Repositories.Core.AutoMapperConfig;
using Repositories.Core.Context;
using Repositories.Core.Validators;
using Api.Middlewares;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;
using StackExchange.Redis;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Carts;
using TicketResell.Services.Services.Categories;
using TicketResell.Services.Services.Tickets;
using TicketResell.Repositories.Logger;
using TicketResell.Services.Services.Payments;
using Repositories.Config;
using TicketResell.Services.Services.History;
using TicketResell.Services.Services.Revenues;

Env.Load();
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppConfig>(config =>
{
    config.SQLServer = Environment.GetEnvironmentVariable("SQLSERVER") ?? "default";
    config.BaseUrl = Environment.GetEnvironmentVariable("BASE_URL") ?? "http://localhost:3000";
    config.MomoPartnerCode = Environment.GetEnvironmentVariable("MOMO_PARTNER_CODE") ?? "default";
    config.MomoAccessKey = Environment.GetEnvironmentVariable("MOMO_ACCESS_KEY") ?? "default";
    config.MomoSecretKey = Environment.GetEnvironmentVariable("MOMO_SECRET_KEY") ?? "default";
    config.MomoApiUrl = Environment.GetEnvironmentVariable("MOMO_API_URL") ?? "https://test-payment.momo.vn/";
    config.TmnCode = Environment.GetEnvironmentVariable("VNPAY_TMN_CODE") ?? "default";
    config.HashSecret = Environment.GetEnvironmentVariable("VNPAY_HASH_SECRET") ?? "default";
    config.VnpayApiUrl = Environment.GetEnvironmentVariable("VNPAY_API_URL") ?? "default";
    config.PayPalClientId = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID") ?? "default";
    config.PayPalSecret = Environment.GetEnvironmentVariable("PAYPAL_SECRET") ?? "default";
    config.PayPalApiUrl = Environment.GetEnvironmentVariable("PAYPAL_API_URL") ?? "https://api-m.sandbox.paypal.com";
    config.RapidapiKey = Environment.GetEnvironmentVariable("RAPIDAPI_KEY") ?? "default";
});
builder.Services.Configure<AppConfig>(builder.Configuration.GetSection("AppConfig"));



JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", Environment.GetEnvironmentVariable("SQLServer"));



// Dbcontext configuration
builder.Services.AddDbContext<TicketResellManagementContext>();
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379"));
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "TicketResellCacheInstance";
});

// Automapper configuration
builder.Services.AddAutoMapper(typeof(AutoMapperConfigProfile));
builder.Services.AddSingleton<IAppLogger, AppLogger>();
builder.Services.AddScoped<IRevenueService, RevenueService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderDetailService, OrderDetailService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ISellConfigService, SellConfigService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IRevenueService, RevenueService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddHttpClient<IMomoService, MomoService>();
builder.Services.AddHttpClient<IVnpayService, VnpayService>();
builder.Services.AddHttpClient<IPaypalService, PaypalService>();


builder.Services.AddSingleton<IServiceProvider>(provider => provider);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderDetailValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CategoryValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<TicketValidator>();
builder.Services.AddScoped<Repositories.Core.Validators.IValidatorFactory, ValidatorFactory>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();  // Enable credentials
        });
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();
app.UseCors("AllowSpecificOrigin");
app.UseSession();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<ValidatorMiddleware>();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
    options.DocumentTitle = "Swagger";
});
app.Run();

JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", "default");
