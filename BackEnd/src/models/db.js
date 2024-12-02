const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "181117",
  database: "practica",
});

module.exports = conn;
