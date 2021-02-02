using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.Member;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository

    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        /// <inheritdoc />
        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        /// <inheritdoc />
        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<AppUser>> GetUserAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }

        /// <inheritdoc />
        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        /// <inheritdoc />
        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync(x => x.Username == username);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<MemberToReturnDto>> GetMembersAsync()
        {
            throw new  NotImplementedException();
        }

        /// <inheritdoc />
        public async Task<MemberToReturnDto> GetMemberByUsernameAsync(string username)
        {
            return await _context.Users.Where(x => x.Username == username)
                .ProjectTo<MemberToReturnDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }
    }
}
