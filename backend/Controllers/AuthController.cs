// TODO: Sú tu použité using ktoré nie su potreba
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SnakeGameBackend2.Models;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    // TODO: nevadí že ten názov je _context ale bolo by lepšie to mať ako _authContext v prípade by si tých contextov mal viac
    private readonly AuthContext _context;
    private readonly ILogger<AuthController> _logger;

    // TODO: Je dobré ošetrenie či sa správne nainicializuje context a logger niečo ako context ?? throw new ArgumentNullException(nameof(context));
    public AuthController(AuthContext context, ILogger<AuthController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // TODO: bolo by dobre zadefinovať ake typy môže táto metóda vracať sú zakomentované 
    // tiež ošetriť výnimky ak sa niečo pokazí/spadne
    // Použítie Cancellation tokenu môžme sa na to kuknúť
    // [ProducesResponseType(StatusCodes.Status200OK)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid model state", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }

        // Štandardne a výdodné je pozžívať všade async načítavania kde je to možné. AnyAsync.
        if (_context.Users.Any(u => u.Username == user.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        _context.Users.Add(user);

        // TODO: toto nie je potreba  var c nikde sa nepoužíva to som len povedal aby sme vedeli čo sa vrátilo
        var c =  await _context.SaveChangesAsync();


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
