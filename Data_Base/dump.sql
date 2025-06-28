CREATE DATABASE RpgNexusDB;
GO
USE RpgNexusDB;


CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role VARCHAR(20) CHECK (Role IN ('Player', 'Master')) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

INSERT INTO Users (Name, Email, PasswordHash, Role)
VALUES ('Felipe', 'felipe@example.com', 'SenhaForte123!','Player');


-- Par�metros de entrada: @Email e @Password
DECLARE @Email NVARCHAR(255) = 'felipe@example.com';
DECLARE @Password NVARCHAR(100) = 'SenhaForte123!';

SELECT Id, Name, Email, Role, IsActive
FROM Users
WHERE Email = @Email
  AND PasswordHash = CONVERT(NVARCHAR(255),@Password, 2)
  AND IsActive = 1;

