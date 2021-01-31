using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs.Account;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto input)
        {
            using var hmac = new HMACSHA512();
            var user = new AppUser()
            {
                Username = input.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input.Password)),
                PasswordSalt = hmac.Key
            };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return new UserDto
            {
                Username = user.Username,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto input)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Username == input.Username);
            if (user == null) return Unauthorized(" Invalid username or password");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedPasswordHashThatUserSubmit = hmac.ComputeHash(Encoding.UTF8.GetBytes(input.Password));
          for (int i = 0; i < computedPasswordHashThatUserSubmit.Length; i++)
          {
              if(computedPasswordHashThatUserSubmit[i] != user.PasswordHash[i]) return Unauthorized(" Invalid username or password");
          }
         

            return new UserDto
            {
                Username = user.Username,
                Token =  _tokenService.CreateToken(user)
            };

        }

    }
}
