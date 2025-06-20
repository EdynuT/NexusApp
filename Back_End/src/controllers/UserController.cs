using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _service = new UserService();

    [HttpGet]
    public ActionResult<List<User>> Get()
    {
        return _service.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] User user)
    {
        _service.Add(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }
}

[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    var user = _service.GetAll().FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password);
    if (user == null)
        return Unauthorized("Invalid credentials");

    // Aqui você pode gerar e retornar um JWT futuramente
    return Ok(user);
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}