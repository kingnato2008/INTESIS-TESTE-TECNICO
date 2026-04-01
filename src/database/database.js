const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "loja",
  password: "",
  port: 5432,
});

module.exports = pool;