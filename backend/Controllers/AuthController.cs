using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SnakeGameBackend2.Models;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthContext _context;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthContext context, ILogger<AuthController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid model state", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }

        if (_context.Users.Any(u => u.Username == user.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        _context.Users.Add(user);
        var c=  await _context.SaveChangesAsync();


      return Ok(new { message = "Registration successful Id:" + user.Id + " value: " + c });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogError("Invalid model state: {ModelState}", ModelState);
            return BadRequest(new { message = "Invalid model state", errors = ModelState });
        }

        var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username && u.Password == user.Password);

        if (existingUser == null)
        {
            _logger.LogWarning("Invalid username or password for user: {Username}", user.Username);
            return Unauthorized(new { message = "Invalid username or password" });
        }

        _logger.LogInformation("User logged in successfully: {Username}", user.Username);
        return Ok(new { message = "Login successful" });
    }
}
