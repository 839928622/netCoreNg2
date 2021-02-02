using API.Data;
using API.Helper;
using API.Interfaces;
using API.Services;
using AutoMapper;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(options =>
            {  //GetConnectionString
                options.UseSqlite(configuration["ConnectionStrings:DefaultConnection"]);
            });

            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddAutoMapper(typeof(AutoMapperProfiles));

            services.AddSingleton(MapsterProfile.GetConfiguredMappingConfig());
            services.AddScoped<MapsterMapper.IMapper, ServiceMapper>();

            return services;
        }
    }
}
