const express = require("express");
const router = express.Router();
const fs = require("fs");
const getQuery = require("../utils/getQuery");

router.get("/", async (req, res) => {
  try {
    let query = getQuery();

    // res.setHeader("Content-Type", "text/html");
    // res.write("<title>Data Loader</title>");
    // res.write("<h1>Connecting to database.</h1><p>");

    let data = fs.readFileSync("./data/data.ddl", { encoding: "utf8" });
    let commands = data.split(";");
    for (let i = 0; i < commands.length; ++i) {
      const command = commands[i];
      if (command.trim().length > 0) {
        console.log(i + ": " + command);
        let result = await query(command);
        console.log(i + ": " + JSON.stringify(result));
      }
    }

    res.redirect("/");
  } catch (err) {
    console.dir(err);
    res.send(err);
  }
});

module.exports = router;
