const express = require("express");
const router = express.Router();
const { getQuery, getConnection } = require("../utils/getQuery");

router.post("/add", async (req, res) => {
  const conn = getConnection();
  try {
    const query = getQuery(conn);
    const productInventoryId = req.body.productInventoryId;
    await query(
      `update productinventory set quantity = quantity + 1 where productInventoryId = '${productInventoryId}'`
    );
  } catch (err) {
    console.error(err);
    console.dir(err);
  }
  conn.end();
});

router.post("/deduct", async (req, res) => {
  const conn = getConnection();
  try {
    const query = getQuery(conn);
    const productInventoryId = req.body.productInventoryId;
    await query(
      `update productinventory set quantity = quantity - 1 where productInventoryId = '${productInventoryId} and quantity > 0'`
    );
  } catch (err) {
    console.error(err);
    console.dir(err);
  }
  conn.end();
});

module.exports = router;
