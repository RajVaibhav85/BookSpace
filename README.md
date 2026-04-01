# BookSpace

> A web-based books reading application that lets users discover, manage, and read books online.

---

## Description / Overview

BookSpace is a full-stack web application built with Node.js and Express that provides a platform for users to browse and read books online. It features user authentication, session management, a PostgreSQL database backend, and PDF rendering capabilities — making it a complete digital reading experience right in the browser.

---

## Demo / Live Link

> No live demo link available yet. Clone and run locally using the instructions below.

---

## Features
-  Clean and responsive UI built with HTML, CSS, and JavaScript
-  User authentication (register & login) with password hashing via bcrypt
-  Session-based user management using express-session
-  Search and filter books by title, author, or genre
-  Web-based book reading with PDF rendering
-  PostgreSQL database integration for persistent storage
-  Bookmarking and reading progress tracking
-  User reviews and ratings for books
-  Organized book browsing and management through history and user library
-  Dedicated user profile to manage user information
---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js                           |
| Framework    | Express.js v5                     |
| Database     | PostgreSQL (via `pg`)             |
| Auth         | bcrypt, express-session           |
| PDF Handling | pdf-lib                           |
| Frontend     | HTML, CSS, Vanilla JavaScript     |

---

## Installation

Make sure you have **Node.js** and **PostgreSQL** installed on your machine.

```bash
# 1. Clone the repository
git clone https://github.com/RajVaibhav85/BookSpace.git

# 2. Navigate into the project directory
cd BookSpace

# 3. Install dependencies
npm install
# install express , pg , sessions , bcrypt 
```

---

## Setup / Configuration

1. Create a PostgreSQL database for BookSpace.
2. Set up your environment variables (see [Environment Variables](#-environment-variables) section).
3. Run the database setup scripts from the `DataBase/` folder to initialize your schema.

---

## Usage

```bash
# Start the server (production)
npm start
# Or navigate to Control and execute node server.js
# Start the server with auto-reload (development)
npm run dev
```

The app will run at `http://localhost:3000` by default (or whichever port is configured).

---

## API Endpoints

> Endpoints are handled in `Control/server.js`. Common routes likely include:

| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| GET    | `/`               | Home / landing page          |
| GET    | `/login`          | Login page                   |
| POST   | `/login`          | Authenticate user            |
| GET    | `/register`       | Registration page            |
| POST   | `/register`       | Create new user account      |
| GET    | `/books`          | Browse available books       |
| GET    | `/books/:id`      | View / read a specific book  |
| GET    | `/logout`         | Log out current user         |

---

## Project Structure
```
BookSpace/
├── About/          # About page assets and content
├── Control/        # Server-side logic (Express routes, controllers)
│   └── server.js   # Main application entry point
├── DataBase/       # Database schema and query files
├── Dumpyard/       # Temporary / archived files ( ignore it is for contributors )
├── Public/         # Static assets (images, icons, etc.)
├── View2/          # Frontend HTML views / templates
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Screenshots / UI Preview

> Screenshots coming soon.

```
Example:
![Home Page](./Public/screenshots/home.png)
![Book Reader](./Public/screenshots/reader.png)
```

---

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookspace
DB_USER=your_db_username
DB_PASSWORD=your_db_password

# Session
SESSION_SECRET=your_super_secret_key
```

> Never commit your `.env` file to version control. It is already listed in `.gitignore`.

---

## Testing

> No automated tests are currently configured. To manually test the application:

1. Start the server with `npm run dev`
2. Visit `http://localhost:3000` in your browser
3. Register a new account and verify login/logout flows
4. Browse books and confirm PDF rendering works correctly
Contributions adding a test suite (e.g., Jest, Mocha) are welcome!

---

## Deployment

You can deploy BookSpace to any Node.js-compatible hosting platform:

**Render / Railway / Heroku:**
```bash
# Set all environment variables in your hosting dashboard
# Set the start command to:
npm start
```

**VPS (e.g., DigitalOcean, AWS EC2):**
```bash
# Install Node.js and PostgreSQL on the server
# Clone the repo, install dependencies, set up .env
# Use PM2 for process management:
npm install -g pm2
pm2 start Control/server.js --name bookspace
```

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add: your feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code is clean and well-commented.

---

##  Roadmap / Future Improvements
-  Mobile-responsive design improvements ( few pages are already implemented testing left )
-  Admin panel for uploading and managing books
-  Email notifications for new book additions
-  Unit and integration test coverage
---

## Known Issues

- No live deployment available yet
- No automated test suite in place
- Environment variable documentation may need updates as the project evolves

> Found a bug? Please open an [issue](https://github.com/RajVaibhav85/BookSpace/issues).

---

## License

This project is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

---

## Authors / Contributors

- **K Sree Vaibhav** — [@RajVaibhav85](https://github.com/RajVaibhav85)
- **C Hemanth Sagar** — [@Hemanth-Zero](https://github.com/Hemanth-Zero)

---

## Acknowledgements

- [Express.js](https://expressjs.com/) — Fast, minimal web framework for Node.js
- [pdf-lib](https://pdf-lib.js.org/) — PDF rendering library
- [bcrypt](https://www.npmjs.com/package/bcrypt) — Secure password hashing
- [node-postgres (pg)](https://node-postgres.com/) — PostgreSQL client for Node.js
- [express-session](https://www.npmjs.com/package/express-session) — Session middleware

---

## Support / Contact

If you have questions, suggestions, or just want to say hi:

-  Open an issue on [GitHub Issues](https://github.com/RajVaibhav85/BookSpace/issues)
-  GitHub: [@RajVaibhav85](https://github.com/RajVaibhav85) [@Hemanth-Zero](https://github.com/Hemanth-Zero)

---

## Note
This project is developed for educational purposes under the guidance of Gireesh Sir.

<p align="center">Made  by  C Hemanth Sagar  , K Sree Vaibhav </p>