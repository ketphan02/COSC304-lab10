const express = require("express");
const router = express.Router();
const { getQuery, getConnection } = require("../utils/getQuery");

router.post("/", async (req, res) => {
  // Have to preserve async context since we make an async call
  // to the database in the validateLogin function.
  let authenticatedUser = await validateLogin(req);
  if (authenticatedUser) {
    req.session.username = req.body.username;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

async function validateLogin(req) {
  if (!req.body || !req.body.username || !req.body.password) {
    return false;
  }

  let username = req.body.username;
  let password = req.body.password;
  let authenticatedUser;
  const conn = getConnection();
  try {
    const query = getQuery(conn);
    console.log("username: " + username);
    authenticatedUser = (await query(
      `select * from customer where userid='${username}'`
    ))[0];
    if (authenticatedUser.password === password) {
      conn.end();
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    conn.end();
    return false;
  }
}

module.exports = router;
