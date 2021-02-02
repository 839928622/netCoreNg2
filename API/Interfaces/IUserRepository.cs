using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs.Member;
using API.Entities;

namespace API.Interfaces
{
   public interface IUserRepository
   {
       void Update(AppUser user);
       Task<bool> SaveAllAsync();
       Task<IEnumerable<AppUser>> GetUserAsync();
       Task<AppUser> GetUserByIdAsync(int id);
       Task<AppUser> GetUserByUsernameAsync(string username);

       Task<IEnumerable<MemberToReturnDto>> GetMembersAsync();
       Task<MemberToReturnDto> GetMemberByUsernameAsync(string username);

   }
}
