using NexusApp.BackEnd.src.services;
using NexusApp.BackEnd.src.models;
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
    public IActionResult Register([FromBody] CreateUser request)
    {
        try
        {
            _service.CreateUser(request.Name, request.Email, request.PasswordHash, request.Role);
            return Ok("User created successfully.");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        try
        {
            bool valid = _service.ValidateLogin(request.Email, request.Password);
            if (!valid)
                return Unauthorized("Invalid credentials");

            // Here you can generate a JWT token or session for the user
            // For simplicity, we just return a success message
            return Ok("Login successful.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}