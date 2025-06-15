# NexusApp

NexusApp is a web application designed for managing RPG campaigns. This project includes both client-side and server-side components, allowing users to interact with the application seamlessly.

## Project Structure

```sh
nexus-app
├── node_modules/         # Node.js instalation modules
├── public/
│   ├── index.html        # Main HTML document
│   ├── css/
│   │   └── styles.css    # Styles for the application
│   └── js/
│       └── script.js     # Client-side JavaScript logic
├── src/
│   └── server.js         # Server-side application entry point
├── package-lock.json     # Other instalation archives
├── package.json          # npm configuration file
├── LICENSE               # Licensing information
└── README.md             # Project documentation
```

## Installation

1. Clone the repository:
```sh
git clone https://github.com/EdynuT/NexusApp.git
cd NexusApp
```

2. Install the dependencies:
```sh
npm install
 ```

## Usage

To start the server, run:
```sh
node src/server.js
```

Open your browser and navigate to `http://localhost:3000` to access the application.

## Features

- User authentication and management
- Campaign management tools
- Dice roller for in-game actions
- Character sheets and bestiary management
- Campaign wiki for notes and lore

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.