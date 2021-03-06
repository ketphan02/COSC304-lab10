const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  // Set the message for the login, if present
  let loginMessage = req.session.username
    ? `Already logged in as ${req.session.username}`
    : false;
  if (req.session.loginMessage) {
    loginMessage = req.session.loginMessage;
    req.session.loginMessage = false;
  }

  res.render("login", {
    title: "Login Screen",
    loginMessage: loginMessage,
  });
});

module.exports = router;
