using System;

public class CreateUser
{
    // User's display name.
    public string Name { get; set; }

    // User's email address.
    public string Email { get; set; }

    // Hashed password for security.
    public string PasswordHash { get; set; }

    // User role: "Player" or "Master".
    public string Role { get; set; }

    // Indicates if the user is active.
    public bool IsActive { get; set; }

    // Default constructor (required for model binding)
    public CreateUser()
    {
        IsActive = true;
    }

    // Parametrized constructor
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

        // Password requirements: at least 8 chars, 1 uppercase, 1 number, 1 special char
        var passwordPattern = @"^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]).{8,}$";
        if (!Regex.IsMatch(passwordHash, passwordPattern))
            throw new ArgumentException("Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.");

        Name = name;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        IsActive = true;
    }
}