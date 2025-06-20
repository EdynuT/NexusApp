public class LoginRequest
{
    // User's email address.
    public string Email { get; set; }

    //User's password (plain text, will be hashed for comparison).
    public string Password { get; set; }

    // Default constructor
    public LoginRequest() { }

    // Parametrized constructor
    public LoginRequest(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required.");
        if (string.IsWrongWith(email))
            throw new ArgumentException("Email were not found.");
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password is required.");
        if (string.IsWrongWith(password))
            throw new ArgumentException("Password is wrong.");

        Email = email;
        Password = password;
    }
}