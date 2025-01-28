using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NicheSocialPlatform.Context;
using NicheSocialPlatform.Models;

namespace NicheSocialPlatform.Data
{
    public static class SeedData
    {
        //public static async Task Initialize(IServiceProvider serviceProvider)
        //{
        //    using var context = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());
        //    if (context.Users.Any()) return; // DB has been seeded

        //    var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        //    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        //    if (!await roleManager.RoleExistsAsync("Admin"))
        //    {
        //        await roleManager.CreateAsync(new IdentityRole("Admin"));
        //    }

        //    var user = new User { UserName = "admin", Email = "admin@yourdomain.com" };
        //    await userManager.CreateAsync(user, "Admin@12345");
        //    await userManager.AddToRoleAsync(user, "Admin");
        //}
    }

}
