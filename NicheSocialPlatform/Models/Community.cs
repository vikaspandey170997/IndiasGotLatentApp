using Microsoft.Extensions.Hosting;

namespace NicheSocialPlatform.Models
{
    public class Community
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Privacy { get; set; } // Public, Private, Secret
        public int CreatedById { get; set; }

        public ICollection<Post> Posts { get; set; }
        public ICollection<User> Members { get; set; }
    }
}

