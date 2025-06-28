public class LoginRequest
{
    public string Identifier { get; set; } = string.Empty; // Can be email or username
    public string Password { get; set; } = string.Empty;

    public LoginRequest() { }

    public LoginRequest(string identifier, string password)
    {
        if (string.IsNullOrWhiteSpace(identifier))
            throw new ArgumentException("Username or Email is required.");
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password is required.");

        Identifier = identifier;
        Password = password;
    }
}