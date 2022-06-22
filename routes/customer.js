const express = require("express");
const router = express.Router();
const auth = require("../auth");
const getQuery = require("../utils/getQuery");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  if (!req.session.username) {
    auth.checkAuthentication(req, res);
  }

  try {
    const query = getQuery();
    const result = (await query(
      `select * from customer where userid='${req.session.username}'`
    ))[0];
    if (!result) {
      throw new Error("No user found");
    }

    res.render("customer", {
        title: "Customer Information",
        username: req.session.username,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        phone: result.phone,
        address: result.address,
        city: result.city,
        state: result.state,
        zip: result.zip,
        country: result.country,
        userid: result.userid,
    });
  } catch (err) {
    console.dir(err);
  }
});

module.exports = router;
