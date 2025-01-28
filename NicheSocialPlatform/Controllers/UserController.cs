using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NicheSocialPlatform.Models;
using NicheSocialPlatform.Dtos;
using NicheSocialPlatform.Context;

namespace NicheSocialPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public UsersController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var user = new User { UserName = model.UserName, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok("User registered successfully!");
            }

            return BadRequest(result.Errors);
        }

    }

}
