﻿using API.Data;
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
            // auto mapper
            services.AddAutoMapper(typeof(AutoMapperProfiles));
            // mapster
            services.AddSingleton(MapsterProfile.GetConfiguredMappingConfig());
            services.AddScoped<MapsterMapper.IMapper, ServiceMapper>();

            services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();

            services.AddScoped<LogUserActivity>();
            return services;
        }
    }
}
