const express = require("express");
const router = express.Router();
const fs = require("fs");
const getQuery = require("../utils/getQuery");

router.get("/", async (req, res) => {
  try {
    let query = getQuery();

    res.setHeader("Content-Type", "text/html");
    res.write("<title>Data Loader</title>");
    res.write("<h1>Connecting to database.</h1><p>");

    let data = fs.readFileSync("./data/data.ddl", { encoding: "utf8" });
    let commands = data.split(";");
    for (const command of commands) {
      if (command.trim().length > 0) {
        res.write("<p>" + command + "</p>");
        let result = await query(command);
        res.write("<p>" + JSON.stringify(result) + "</p>");
        setInterval(() => {}, 200);
      }
    }

    res.write('"<h2>Database loading complete!</h2>');
    res.end();
  } catch (err) {
    console.dir(err);
    res.send(err);
  }
});

module.exports = router;
