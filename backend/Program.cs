using Microsoft.EntityFrameworkCore;
using SnakeGameBackend2.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register LeaderboardContext with PostgreSQL
builder.Services.AddDbContext<LeaderboardContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<AuthContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins(new string[]{"https://localhost:63342", "http://localhost:63342"}) // Add your frontend URL here
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SnakeGameBackend2 API v1");
        c.RoutePrefix = "api/v1/leaderboard/swagger";
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin"); // Ensure this is placed before UseRouting()

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
