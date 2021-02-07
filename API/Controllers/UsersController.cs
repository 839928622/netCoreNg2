using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs.Member;
using API.DTOs.Photo;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class UsersController: BaseApiController
    {
        private readonly IUserRepository _userRepository;
   
        private readonly MapsterMapper.IMapper _mapster;
        private readonly IPhotoService _photoService;


        public UsersController(IUserRepository userRepository, MapsterMapper.IMapper mapster,
                               IPhotoService photoService)
        {
            _userRepository = userRepository;
         
            _mapster = mapster;
            _photoService = photoService;
        }

        [HttpGet("GetUsers")]
        public async Task<ActionResult<IEnumerable<MemberToReturnDto>>> GetUsers()
        {
            //var users = await _userRepository.GetUserAsync();
            //return Ok(_mapper.Map<IEnumerable<MemberToReturnDto>>(users));
            return Ok(await _userRepository.GetMembersAsync());
        }

        [HttpGet("GetUser/{username}",Name = "GetUser")]
        public async Task<ActionResult<MemberToReturnDto>> GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            return _mapster.Map<MemberToReturnDto>(user);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto model)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _mapster.Map(model, user);
            _userRepository.Update(user);
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Fail to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo()
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (!user.Photos.Any())
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);
            if ( await _userRepository.SaveAllAsync())
            {
                //return _mapster.Map<PhotoDto>(photo);
                return CreatedAtRoute("GetUser",new {username = user.Username}, _mapster.Map<PhotoDto>(photo));
            }

            return BadRequest("An error occurred during adding photo(s)");
        }
    }
}
