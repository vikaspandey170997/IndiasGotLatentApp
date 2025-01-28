﻿using System.Xml.Linq;

namespace NicheSocialPlatform.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ImageUrl { get; set; }
        public string VideoUrl { get; set; }
    }
}
