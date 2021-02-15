using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs.Message;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;

        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        [HttpPost]

        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
           
            // check username Equals to current user's username
            if (username == createMessageDto.RecipientUsername) return BadRequest("You can't send messages to yourself");

            var sender = await _userRepository.GetUserByIdAsync(User.GetUserId());

            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) return NotFound();
          
            var message = new Message()
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.Username,
                RecipientUsername = recipient.Username,
                Content = createMessageDto.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));
            return BadRequest("Fail to send message");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser(
            [FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _messageRepository.GetMessageForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage,messages.PageSize,messages.TotalCount,messages.TotalPage);

            return messages;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="username">username is other user that current login user talking to</param>
        /// <returns></returns>
        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await _messageRepository.GetMessage(id);
            if (message.Sender.Username != username && message.Recipient.Username != username) return Unauthorized();

            if (message.Sender.Username == username) 
            {
                message.SenderDeleted    = true;
            }

            if (message.Recipient.Username == username)
            {
                message.RecipientDeleted = true;
            }

            if (message.SenderDeleted && message.RecipientDeleted)
            {
                _messageRepository.DeleteMessage(message);
            }

            if (await _messageRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting the message");
        }
    }
}
