﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["TokenKey"]));
        }
     
        /// <inheritdoc />
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.NameId,user.Username),
             
            };
           
            var signingCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(5),
                SigningCredentials = signingCredentials
            };

            var tokenHandle = new JwtSecurityTokenHandler();
            var token = tokenHandle.CreateToken(tokenDescriptor);
            return tokenHandle.WriteToken(token);
        }
    }
}