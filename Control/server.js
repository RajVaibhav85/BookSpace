const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Session middleware (simple server-side sessions)
app.use(session({
  secret: 'change-this-secret-to-a-secure-random-value',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.use(express.static(path.join(__dirname, "../Public")));
app.use(express.static(path.join(__dirname, "../View")));
app.use(express.static(path.join(__dirname, "../View2")));

const pageRoutes = require("./Routes/pageRoutes");
app.use("/", pageRoutes);

//--------------------------------- DATABASE SETUP-------------------------
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,            
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL as superuser!"))
  .catch(err => console.error("Connection error:", err));

module.exports = pool;

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const registerRoutes = require('../Control/Routes/userRoutes');
app.use("/user", registerRoutes);

const apiRoutes = require('../Control/Routes/apiRoutes');
app.use("/api",apiRoutes);
const bookRoutes = require('../Control/Routes/bookRoutes');
app.use("/book", bookRoutes);


// 404 handler - redirect to the error page with a 404 code so the
// client-side script can render a friendly message.
app.use((req, res, next) => {
  const params = new URLSearchParams({
    code: '404',
    title: 'Page Not Found',
    message: "The page you requested could not be found."
  }).toString();
  return res.status(404).redirect(`/errorpage.html?${params}`);
});

// Global error handler - logs the error and redirects to the error page
// with some details encoded in query params. Avoid exposing full stacks in
// production; this is intended for development and friendly feedback.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  const params = new URLSearchParams({
    code: (err && err.status) || 500,
    title: (err && err.title) || 'Internal Server Error',
    message: (err && err.message) || 'An unexpected error occurred.',
    detail: (err && (err.stack || err.message)) || ''
  }).toString();
  // Send a redirect to the static error page which will read the query
  // params and display them.
  return res.status((err && err.status) || 500).redirect(`/errorpage.html?${params}`);
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});