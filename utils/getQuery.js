const mysql = require("mysql2");
const util = require("util");

const dbConfig = {
  user: "b4f4925ef52b8c",
  password: "73e280c9",
  host: "us-cdbr-east-05.cleardb.net",
  database: "heroku_c245386d7bb3360",
  insecureAuth : true
};

// const dbConfig = {
//   user: "cosc304",
//   password: "cosc304",
//   host: "localhost",
//   database: "cosc304",
//   insecureAuth : true
// };

const getQuery = () => {
  const conn = mysql.createConnection(dbConfig);
  const query = util.promisify(conn.query).bind(conn);
  return query;
};


module.exports = getQuery;
