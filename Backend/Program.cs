
using Backend.Core.AutoMapperConfig;
using Backend.Utils;
using DotNetEnv;
using Backend.Core.Context;
using Backend.Repositories;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", Environment.GetEnvironmentVariable("SQLServer"));

// Dbcontext configuration
builder.Services.AddDbContext<TicketResellManagementContext>();
// Automapper configuration
builder.Services.AddAutoMapper(typeof(AutoMapperConfigProfile));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();

builder.Services.AddScoped<ISellConfigRepository, SellConfigRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

// Add services to the container.
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", "default");
