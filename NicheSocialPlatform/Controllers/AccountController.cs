using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NicheSocialPlatform.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NicheSocialPlatform.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        public class AccountController : ControllerBase
        {
            private readonly UserManager<IdentityUser> _userManager;
            private readonly SignInManager<IdentityUser> _signInManager;
            private readonly IConfiguration _configuration;

            public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration)
            {
                _userManager = userManager;
                _signInManager = signInManager;
                _configuration = configuration;
            }

            [HttpPost("register")]
            public async Task<IActionResult> Register([FromBody] RegisterDto registrationDto)
            {
                var user = new IdentityUser { UserName = registrationDto.UserName, Email = registrationDto.Email };
                var result = await _userManager.CreateAsync(user, registrationDto.Password);

                if (result.Succeeded)
                {
                    return Ok("User registered successfully");
                }

                return BadRequest(result.Errors);
            }

            [HttpPost("login")]
            public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
            {
                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null) return Unauthorized();

                var result = await _signInManager.PasswordSignInAsync(user.UserName, loginDto.Password, false, false);
                if (result.Succeeded)
                {
                    var token = GenerateJwtToken(user);
                    return Ok(new { token });
                }

                return Unauthorized();
            }

            private string GenerateJwtToken(IdentityUser user)
            {
                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                var jwtKey = _configuration["Jwt:Key"];

                if (string.IsNullOrEmpty(jwtKey))
                {
                    throw new ArgumentNullException(nameof(jwtKey), "JWT Key cannot be null");
                }
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Issuer"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: creds);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
        }
    }

