using HealthFitness.API.DTOs;
using HealthFitness.API.Models;
using HealthFitness.API.Security;
using HealthFitness.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IJwtService _jwtService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IJwtService jwtService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register(RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Validation failed", errors));
        }

        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("User with this email already exists"));
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            Name = dto.Name,
            Age = dto.Age,
            Gender = dto.Gender,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Failed to create user", errors));
        }

        // Assign User role
        await _userManager.AddToRoleAsync(user, "User");

        // Get roles and claims
        var roles = await _userManager.GetRolesAsync(user);
        var userClaims = await _userManager.GetClaimsAsync(user);
        
        // Get role claims
        var roleClaims = new List<System.Security.Claims.Claim>();
        foreach (var roleName in roles)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                var claims = await _roleManager.GetClaimsAsync(role);
                roleClaims.AddRange(claims);
            }
        }

        // Combine all claims
        var allClaims = userClaims.Concat(roleClaims).ToList();

        // Generate JWT token
        var token = _jwtService.GenerateToken(user, roles, allClaims);

        var response = new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            Name = user.Name,
            Roles = roles.ToList()
        };

        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(response, "Registration successful"));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse("Validation failed", errors));
        }

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.ErrorResponse("Invalid email or password"));
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.ErrorResponse("Invalid email or password"));
        }

        // Get roles and claims
        var roles = await _userManager.GetRolesAsync(user);
        var userClaims = await _userManager.GetClaimsAsync(user);
        
        // Get role claims (permissions)
        var roleClaims = new List<System.Security.Claims.Claim>();
        foreach (var roleName in roles)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                var claims = await _roleManager.GetClaimsAsync(role);
                roleClaims.AddRange(claims);
            }
        }

        // Combine all claims
        var allClaims = userClaims.Concat(roleClaims).ToList();

        // Generate JWT token
        var token = _jwtService.GenerateToken(user, roles, allClaims);

        var response = new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            Name = user.Name,
            Roles = roles.ToList()
        };

        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(response, "Login successful"));
    }
    [HttpGet("me")]
    public ActionResult<object> GetCurrentUser()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
        return Ok(new { 
            User.Identity.Name, 
            IsAuthenticated = User.Identity.IsAuthenticated,
            Claims = claims 
        });
    }
}
