using NexusApp.BackEnd.src.models;
using NexusApp.BackEnd.utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace NexusApp.BackEnd.src.services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public void CreateUser(string name, string email, string plainPassword, string role, string userName)
        {
            var passwordPattern = @"^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]).{8,}$";
            if (!Regex.IsMatch(plainPassword, passwordPattern))
                throw new ArgumentException("Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.");

            string passwordHash = PasswordHasher.Hash(plainPassword);

            var user = new User(name, email, passwordHash, role)
            {
                UserName = userName
            };
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public User? GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }

        public User? GetByUserName(string userName)
        {
            return _context.Users.FirstOrDefault(u => u.UserName == userName);
        }

        public bool ValidateLogin(string identifier, string password)
        {
            var user = _context.Users.FirstOrDefault(u =>
                u.Email == identifier || u.UserName == identifier);

            if (user == null)
                return false;

            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
                throw new Exception("Account is locked. Try again later.");

            if (PasswordHasher.Verify(password, user.PasswordHash))
            {
                user.FailedLoginAttempts = 0;
                _context.SaveChanges();
                return true;
            }
            else
            {
                user.FailedLoginAttempts++;
                if (user.FailedLoginAttempts >= 3)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(30);
                    user.FailedLoginAttempts = 0;
                }
                _context.SaveChanges();
                return false;
            }
        }

        // Dictionary to store password reset codes (em memória, pode ser melhorado para produção)
        private static Dictionary<string, string> passwordResetCodes = new Dictionary<string, string>();

        public string GeneratePasswordResetCode(string email)
        {
            var user = GetByEmail(email);
            if (user == null)
                throw new Exception("User not found.");

            var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            passwordResetCodes[email] = code;

            Console.WriteLine($"Password reset code for {email}: {code}");

            return code;
        }

        public bool ResetPassword(string email, string code, string newPassword)
        {
            if (!passwordResetCodes.ContainsKey(email) || passwordResetCodes[email] != code)
                return false;

            var user = GetByEmail(email);
            if (user == null)
                return false;

            user.PasswordHash = PasswordHasher.Hash(newPassword);
            passwordResetCodes.Remove(email);
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            _context.SaveChanges();
            return true;
        }

        public User? Login(LoginRequest login)
        {
            var user = _context.Users.FirstOrDefault(u =>
                u.Email.Equals(login.Identifier, StringComparison.OrdinalIgnoreCase) ||
                u.UserName.Equals(login.Identifier, StringComparison.OrdinalIgnoreCase));

            if (user == null)
                return null;

            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
                throw new Exception("Account is locked. Try again later.");

            if (PasswordHasher.Verify(login.Password, user.PasswordHash))
            {
                user.FailedLoginAttempts = 0;
                _context.SaveChanges();
                return user;
            }
            else
            {
                user.FailedLoginAttempts++;
                if (user.FailedLoginAttempts >= 3)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(30);
                    user.FailedLoginAttempts = 0;
                }
                _context.SaveChanges();
                return null;
            }
        }
    }
}