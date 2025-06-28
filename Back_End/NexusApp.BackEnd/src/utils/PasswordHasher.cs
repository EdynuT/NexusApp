using System;
using System.Security.Cryptography;

namespace NexusApp.BackEnd.utils
{
    public static class PasswordHasher
    {
        // Generates a secure hash for the given password using PBKDF2
        public static string Hash(string password)
        {
            // Parameters for PBKDF2
            int saltSize = 16;
            int keySize = 32;
            int iterations = 10000;

            // Generates random salt and derives a key using PBKDF2
            using (var rng = RandomNumberGenerator.Create())
            {
                var salt = new byte[saltSize];
                rng.GetBytes(salt);

                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256))
                {
                    var key = pbkdf2.GetBytes(keySize);
                    // Format: {iterations}.{salt}.{hash}
                    return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(key)}";
                }
            }
        }

        // Verifies if the password matches the hashed password
        public static bool Verify(string password, string hashedPassword)
        {
            var parts = hashedPassword.Split('.', 3);
            if (parts.Length != 3)
                return false;

            int iterations = int.Parse(parts[0]);
            var salt = Convert.FromBase64String(parts[1]);
            var key = Convert.FromBase64String(parts[2]);

            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256))
            {
                var keyToCheck = pbkdf2.GetBytes(key.Length);
                return CryptographicOperations.FixedTimeEquals(key, keyToCheck);
            }
        }
    }
}