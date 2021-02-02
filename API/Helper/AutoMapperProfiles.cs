using System.Linq;
using API.DTOs.Member;
using API.DTOs.Photo;
using API.Entities;
using AutoMapper;

namespace API.Helper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberToReturnDto>()
                .ForMember(dest => dest.MainPhotoUrl, 
                    options => options.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Photo, PhotoDto>();
        }
    }
}
