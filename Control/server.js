const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../Public")));
app.use(express.static(path.join(__dirname, "../View")));

const pageRoutes = require("./Routes/pageRoutes");
app.use("/", pageRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//--------------------------------- DATABASE SETUP-------------------------
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        // default superuser
  host: 'localhost',       // WSL + PostgreSQL is local
  database: 'bookspace',    // default database (or your custom DB)
  password: 'mypostgres', // the password you set during install
  port: 5432,              // default PostgreSQL port
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL as superuser!"))
  .catch(err => console.error("Connection error:", err));

