const express = require("express");
const router = express.Router();
const { getQuery } = require("../utils/getQuery");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "image/jpeg");

  let id = req.query.productId;
  let idVal = parseInt(id);
  if (isNaN(idVal)) {
    res.end();
    return;
  }

  try {
    const query = getQuery();
    const result = await query(
      `select productImage from product where productId = ${idVal}`
    );

    if (result.length === 0) {
      console.log("No image record");
      return;
    } else {
      let productImage = result[0].productImage;

      res.write(productImage);
    }
  } catch (err) {
    console.dir(err);
    res.write(err + "");
  } finally {
    res.end();
  }
});

module.exports = router;
