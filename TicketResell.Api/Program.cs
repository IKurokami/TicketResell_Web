using Api.Utils;
using DotNetEnv;

using FluentValidation;
using Repositories.Core.AutoMapperConfig;
using Repositories.Core.Context;
using Repositories.Core.Validators;
using Api.Middlewares;
using StackExchange.Redis;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Tickets;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
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

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderDetailService, OrderDetailService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ISellConfigService, SellConfigService>();
builder.Services.AddScoped<IRoleService, RoleService>();

builder.Services.AddSingleton<IServiceProvider>(provider => provider);

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
            policy.WithOrigins("http://localhost:3000") // Add your front-end URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
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
app.Run();

JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", "default");
