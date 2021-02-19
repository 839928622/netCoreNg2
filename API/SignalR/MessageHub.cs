using System;
using System.Threading.Tasks;
using API.DTOs.Message;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public MessageHub(IMessageRepository messageRepository, IMapper mapper,IUserRepository userRepository)
        {
            _messageRepository = messageRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        /// <inheritdoc />
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var callerUserName = Context.User.GetUsername();
            var otherUser = httpContext.Request.Query["user"].ToString();

            var groupName = GetGroupName(callerUserName, otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var messages = await _messageRepository.GetMessageThread(callerUserName, otherUser);
            await Clients.Group(groupName).SendAsync("ReceiveMessageThread",messages);
        }

        /// <inheritdoc />
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // signalR will remove her/him from group automatically when anyone disconnected
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            // check username Equals to current user's username
            if (username == createMessageDto.RecipientUsername) throw new HubException("You cannot send messages to yourself");

            var sender = await _userRepository.GetUserByIdAsync(Context.User.GetUserId());

            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("Not found user");

            var message = new Message()
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                var groupName = GetGroupName(sender.UserName, recipient.UserName);
                var messageDto = _mapper.Map<MessageDto>(message);
                await Clients.Group(groupName).SendAsync("NewMessage", messageDto);
            };
            
        }

        private static string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
