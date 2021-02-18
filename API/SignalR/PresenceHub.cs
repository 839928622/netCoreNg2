using System;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub: Hub
    {
        /// <inheritdoc />
        public override async Task OnConnectedAsync()
        {
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
            //return base.OnConnectedAsync();
        }

        /// <inheritdoc />
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
            await base.OnDisconnectedAsync(exception);
        }
    }
}
