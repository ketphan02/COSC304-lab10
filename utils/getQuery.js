const mysql = require("mysql2");
const util = require("util");

// const dbConfig = {
//   user: "root",
//   password: "cosc304",
//   host: "db",
//   database: "cosc304",
//   insecureAuth : true
// };

const dbConfig = {
  user: "cosc304",
  password: "cosc304",
  host: "localhost",
  database: "cosc304",
  insecureAuth : true
};

const getQuery = () => {
  const conn = mysql.createConnection(dbConfig);
  const query = util.promisify(conn.query).bind(conn);
  return query;
};


module.exports = getQuery;
