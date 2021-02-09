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
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService tokenService, IUserRepository userRepository,
                                 IMapper mapper)
        {
            _context = context;
            _tokenService = tokenService;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto input)
        {
            var existUser = await _userRepository.GetUserByUsernameAsync(input.Username);
            if (existUser != null) return BadRequest("Username is taken");
            var user = _mapper.Map<AppUser>(input);
            using var hmac = new HMACSHA512();

            user.Username = input.Username;
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input.Password));
            user.PasswordSalt = hmac.Key;
           
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
            var user = await _context.Users.Include(u => u.Photos).SingleOrDefaultAsync(x => x.Username == input.Username);
            if (user == null) return Unauthorized(" Invalid username or password");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedPasswordHashThatUserSubmit = hmac.ComputeHash(Encoding.UTF8.GetBytes(input.Password));
          if (computedPasswordHashThatUserSubmit.Where((t, i) => t != user.PasswordHash[i]).Any())
          {
              return Unauthorized(" Invalid username or password");
          }
         

            return new UserDto
            {
                Username = user.Username,
                Token =  _tokenService.CreateToken(user),
                MainPhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain == true)?.Url
                
            };

        }

    }
}
