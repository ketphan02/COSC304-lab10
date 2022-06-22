const express = require("express");
const router = express.Router();
const moment = require("moment");
const { getQuery } = require("../utils/getQuery");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  // TODO: Get order id
  const orderId = req.query.orderId;

  let errMsg;
  try {
    if (!orderId) {
      errMsg = "No order id provided";
      throw Error(errMsg);
    }
    const query = getQuery();
    const orderInformation = (
      await query(`select * from ordersummary where orderId = ${orderId}`)
    )[0];
    if (!orderInformation) {
      errMsg = "Invalid order id";
      throw new Error(errMsg);
    }

    const orderedProducts = await query(
      `select * from orderproduct where orderId = ${orderId}`
    );
    const warehouseId = 1;
    orderedProducts.forEach(async (product) => {
      const productQuantity = product.quantity;
      const allProductsInInventory = (
        await query(
          `select * from productinventory where warehouseId=${warehouseId} and productId = ${product.productId}`
        )
      )[0];
      if (productQuantity > allProductsInInventory.quantity) {
        errMsg = `Insufficient in inventory.`;
        throw new Error(errMsg);
      }
    });

    await query(
      `insert into shipment values (now(), 'shipment for order ${orderId}', ${warehouseId})`
    );
    const shipmentId = await query("last_insert_id()");
    await query(
      `update ordersummary set shipmentId = ${shipmentId} where orderId = ${orderId}`
    );

    const resultMessage = `Order ${orderId} has been shipped.`;
    res.render("ship", {
      title: "Shipment",
      resultMessage,
    });
  } catch (err) {
    console.dir(err);

    if (errMsg) {
      res.render("ship", {
        title: "Shipment",
        resultMessage: `Error: ${errMsg}`,
      });
    }
  }
});

module.exports = router;
