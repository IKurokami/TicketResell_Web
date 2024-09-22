
using Backend.Core.AutoMapperConfig;
using Backend.Utils;
using DotNetEnv;
using Backend.Core.Context;
using Backend.Repositories;
using Backend.Repositories.Categories;
using Backend.Repositories.Tickets;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", Environment.GetEnvironmentVariable("SQLServer"));

// Dbcontext configuration
builder.Services.AddDbContext<TicketResellManagementContext>();
// Automapper configuration
builder.Services.AddAutoMapper(typeof(AutoMapperConfigProfile));
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRevenueRepository, RevenueRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
// Add services to the container.
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", "default");
