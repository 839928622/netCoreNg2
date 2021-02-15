using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Message;
using API.Entities;
using API.Helper;
using API.Interfaces;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }
      

        /// <inheritdoc />
        public void AddMessage(Message message)
        {
            _context.Message.Add(message);
        }

        /// <inheritdoc />
        public void DeleteMessage(Message message)
        {
            _context.Message.Remove(message);
        }

        /// <inheritdoc />
        public async Task<Message> GetMessage(int id)
        {
            // FindAsync wont include Sender and Recipient
            return await _context.Message
                .Include(u => u.Sender)
                .Include(u => u.Recipient)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        /// <inheritdoc />
        public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams)
        {
            var query = _context.Message.OrderByDescending(x => x.MessageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.Recipient.Username == messageParams.Username && u.RecipientDeleted == false ),
                "Outbox" => query.Where(u => u.Sender.Username == messageParams.Username && u.SenderDeleted == false ),
                _ => query.Where(u => u.Recipient.Username == messageParams.Username && u.DateRead == null && u.RecipientDeleted == false)
            };

            var messages = query.ProjectToType<MessageDto>(_mapper.Config);

            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await _context.Message
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(r => r.Recipient).ThenInclude(r=>r.Photos)
                .Where(x =>
                x.Recipient.Username == currentUsername && x.Sender.Username == recipientUsername && x.RecipientDeleted == false
                || 
                x.Sender.Username == recipientUsername && x.Sender.Username == currentUsername && x.SenderDeleted == false)
                .OrderBy(x => x.MessageSent).ToListAsync();
            // mark message to read because current user was reading
            var unreadMessages = messages.Where(m => m.DateRead == null
                                                     && m.Recipient.Username == currentUsername).ToList();
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTimeOffset.Now;
                }

                //Parallel.ForEach(unreadMessages,
                //    new ParallelOptions() {MaxDegreeOfParallelism = System.Environment.ProcessorCount}, (message) =>
                //    {
                //        message.DateRead = DateTimeOffset.Now;
                //    });

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        /// <inheritdoc />
        public async Task<bool> SaveAllAsync()
        {
            return (await _context.SaveChangesAsync() > 0);
        }
    }
}
