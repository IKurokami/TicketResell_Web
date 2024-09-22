
using Backend.Core.AutoMapperConfig;
using Backend.Utils;
using DotNetEnv;
using Backend.Core.Context;
using Backend.Repositories;
using Backend.Middlewares;
using Backend.Core.Validators;
using FluentValidation;
Env.Load();

var builder = WebApplication.CreateBuilder(args);
JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", Environment.GetEnvironmentVariable("SQLServer"));

// Dbcontext configuration
builder.Services.AddDbContext<TicketResellManagementContext>();
// Automapper configuration
builder.Services.AddAutoMapper(typeof(AutoMapperConfigProfile));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRevenueRepository, RevenueRepository>();

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();

builder.Services.AddScoped<ISellConfigRepository, SellConfigRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderValidator>();

builder.Services.AddScoped<Backend.Core.Validators.IValidatorFactory, ValidatorFactory>();
var app = builder.Build();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", "default");
