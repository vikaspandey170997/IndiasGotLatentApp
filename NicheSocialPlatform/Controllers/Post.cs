using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NicheSocialPlatform.Context;
using NicheSocialPlatform.Dtos;
using NicheSocialPlatform.Models;

namespace NicheSocialPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _uploadFolder;

        public PostsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _uploadFolder = _configuration["Storage:UploadFolder"];
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDto createPostDto)
        {
            if (createPostDto.Video == null && createPostDto.Image == null) 
            {
                return BadRequest("At least one file (image or video) is required.");
            }

            var post = new Post
            {
                Title = createPostDto.Title,
                Description = createPostDto.Description,
            };

            if (createPostDto.Image != null)
            {
                var imageFileName = Path.GetFileName(createPostDto.Image.FileName);
                var imageFilePath = Path.Combine(_uploadFolder, imageFileName);

                using (var stream = new FileStream(imageFilePath, FileMode.Create))
                {
                    await createPostDto.Image.CopyToAsync(stream);
                }

                post.ImageUrl = $"/uploads/{imageFileName}";
            }

            if (createPostDto.Video != null)
            {
                var videoFileName = Path.GetFileName(createPostDto.Video.FileName);
                var videoFilePath = Path.Combine(_uploadFolder, videoFileName);

                using (var stream = new FileStream(videoFilePath, FileMode.Create))
                {
                    await createPostDto.Video.CopyToAsync(stream);
                }

                post.VideoUrl = $"/uploads/{videoFileName}";
            }

            // Save the post to the database
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(post);
        }
    }
}
