using System;

public class CreateUser
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    public CreateUser()
    {
        IsActive = true;
    }

    public CreateUser(string name, string email, string passwordHash, string role)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required.");
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required.");
        if (!email.Contains("@") || !email.Contains("."))
            throw new ArgumentException("Invalid email format.");
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("Password hash is required.");
        if (string.IsNullOrWhiteSpace(role))
            throw new ArgumentException("Role is required.");

        Name = name;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        IsActive = true;
    }
}