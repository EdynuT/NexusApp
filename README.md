# Game Management App

## Overview
The Game Management App is a web application designed for players and game masters to manage tabletop role-playing games. It provides features for user authentication, campaign management, combat tracking, and character sheet viewing.

## Features
- **User Authentication**: Players and game masters can register and log in to the application.
- **Campaign Management**: Game masters can create, view, and manage campaigns.
- **Combat Management**: Tools for tracking combat scenarios and initiative order.
- **Character Sheets**: Players can view their character sheets, and game masters can access all player sheets within their campaigns.

## Project Structure
```
NexusApp
├── game-management-app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Campaigns/
│   │   │   ├── Combat/
│   │   │   ├── Dashboard/
│   │   │   └── Sheets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── style/
│   ├── package.json
│   └── tsconfig.json
├── package-lock.json
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/EdynuT/NexusApp.git
   ```
2. Navigate to the project directory:
   ```
   cd NexusApp
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
