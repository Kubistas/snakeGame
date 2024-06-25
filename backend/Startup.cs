using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using SnakeGameBackend2.Models;
using Microsoft.AspNetCore.Mvc;

namespace SnakeGameBackend2
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public static string? ConnectionString { get; private set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DefaultConnection");
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AuthContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<LeaderboardContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddControllers();

            services.AddApiVersioning(o =>
            {
                o.ReportApiVersions = true;
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new ApiVersion(1, 0);
            });

            /*services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder
                        .WithOrigins("https://localhost:63342") // Add your frontend URL here
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
            });*/
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            //app.UseCors("AllowSpecificOrigin"); // Ensure this is placed before UseRouting()

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public static string? GetConnectionString()
        {
            return ConnectionString;
        }
    }
}
