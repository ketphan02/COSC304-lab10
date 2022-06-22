const express = require("express");
const router = express.Router();
const getQuery = require("../utils/getQuery");

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
  try {
    const query = getQuery();
    console.log("username: " + username);
    authenticatedUser = (await query(
      `select * from customer where userid='${username}'`
    ))[0];
    if (authenticatedUser.password === password) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = router;
