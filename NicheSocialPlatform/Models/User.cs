using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;

namespace NicheSocialPlatform.Models
{
    public class User : IdentityUser
    {
     
    public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        // Navigation properties
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Community> Communities { get; set; } = new List<Community>();
    }
}

