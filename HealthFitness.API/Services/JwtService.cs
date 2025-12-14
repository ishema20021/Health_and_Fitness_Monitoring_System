using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HealthFitness.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace HealthFitness.API.Services;

public interface IJwtService
{
    string GenerateToken(ApplicationUser user, IList<string> roles, IEnumerable<Claim> claims);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(ApplicationUser user, IList<string> roles, IEnumerable<Claim> claims)
    {
        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? user.Email ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Add additional claims (permissions)
        authClaims.AddRange(claims);

        // Ensure roles are added as claims
        foreach (var role in roles)
        {
            // Avoid duplicates if already in claims
            if (!authClaims.Any(c => c.Type == ClaimTypes.Role && c.Value == role))
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        var keyString = _configuration["Jwt:Secret"];
        if (string.IsNullOrEmpty(keyString) || keyString.Length < 16)
        {
             // Fallback for dev if config is missing (though should be in appsettings)
             keyString = "DetailedHealthFitnessSecretKey2024!"; 
        }

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            expires: DateTime.Now.AddHours(5),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
