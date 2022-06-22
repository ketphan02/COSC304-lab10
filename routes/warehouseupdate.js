const express = require("express");
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const query = getQuery();
    const productInventoryId = req.body.productInventoryId;
    await query(
      `update productinventory set quantity = quantity + 1 where productInventoryId = '${productInventoryId}'`
    );
  } catch (err) {
    console.error(err);
    console.dir(err);
  }
});

router.post("/deduct", async (req, res) => {
  try {
    const query = getQuery();
    const productInventoryId = req.body.productInventoryId;
    await query(
      `update productinventory set quantity = quantity - 1 where productInventoryId = '${productInventoryId} and quantity > 0'`
    );
  } catch (err) {
    console.error(err);
    console.dir(err);
  }
});

module.exports = router;
