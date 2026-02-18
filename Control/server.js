const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../Public")));
app.use(express.static(path.join(__dirname, "../View")));
app.use(express.static(path.join(__dirname, "../View2")));

const pageRoutes = require("./Routes/pageRoutes");
app.use("/", pageRoutes);

//--------------------------------- DATABASE SETUP-------------------------
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',       
  database: 'bookspace',    
  password: 'mypostgres', 
  port: 5432,              
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL as superuser!"))
  .catch(err => console.error("Connection error:", err));

module.exports = pool;

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const registerRoutes = require('../Control/Routes/userRoutes');
app.use("/", registerRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});