using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using PasswordHasher = PasswordHasher; // Ajuste o namespace se necessário

public class FailedLoginAttempts
{
    // Simulating a database with an in-memory list.
    private static List<User> users = new List<User>();

    public List<User> GetAll()
    {
        return users;
    }

    public void Add(User user)
    {
        users.Add(user);
    }

    public User GetByEmail(string email)
    {
        return users.FirstOrDefault(u => u.Email == email);
    }

    public bool ValidateLogin(string email, string password)
    {
        var user = GetByEmail(email);
        if (user == null)
            return false;

        // Check if user is locked out
        if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            throw new Exception("Account is locked. Try again later.");

        // Use PasswordHasher to verify the password
        if (PasswordHasher.Verify(password, user.PasswordHash))
        {
            user.FailedLoginAttempts = 0;
            return true;
        }
        else
        {
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= 3)
            {
                user.LockoutEnd = DateTime.UtcNow.AddMinutes(30);
                user.FailedLoginAttempts = 0;
                throw new Exception("Account locked due to too many failed attempts.");
            }
            return false;
        }
    }

    // Dictionary to store password reset codes
    private static Dictionary<string, string> passwordResetCodes = new Dictionary<string, string>();

    // Creates and sends a password reset code for the corresponding email
    public string GeneratePasswordResetCode(string email)
    {
        var user = GetByEmail(email);
        if (user == null)
            throw new Exception("User not found.");

        // Create a random 6-digit code
        var code = RandomNumberGenerator.GetInt32(000000, 999999).ToString();
        passwordResetCodes[email] = code;

        // Here you will send the code to the user's email.
        Console.WriteLine($"Password reset code for {email}: {code}");

        return code;
    }

    // Validate the code and reset the password if valid 
    public bool ResetPassword(string email, string code, string newPassword)
    {
        if (!passwordResetCodes.ContainsKey(email) || passwordResetCodes[email] != code)
            return false;

        var user = GetByEmail(email);
        if (user == null)
            return false;

        // Hash the new password before saving
        user.PasswordHash = PasswordHasher.Hash(newPassword);
        passwordResetCodes.Remove(email);
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
        return true;
    }
}