const express = require("express");
const router = express.Router({ mergeParams: true });
const getQuery = require("../utils/getQuery");
const query = getQuery();

router.get("/", async (req, res) => {
  let errMsg = "";
  let warehouseList;
  try {
    let warehouses = await query(`select * from warehouse`);
    // create a list of warehouse that navigate before when click
    warehouseList = "<ol>";
    warehouses.forEach((warehouse) => {
      warehouseList += `<li><a href="/warehouse/${warehouse.warehouseId}">${warehouse.warehouseName}</a></li>`;
    });
    warehouseList += "</ol>";
  } catch (err) {
    errMsg = err.message;
  }

  res.render("warehouse", {
    title: "Kiet Phan Grocery Store - Warehouse",
    warehouseList,
    errMsg,
    username: req.session.username,
  });
});

router.get("/:warehouseId", async (req, res) => {
  let errMsg = "";
  const warehouseId = req.params.warehouseId;
  let itemList;
  try {
    const items = await query(`
      select * from productinventory inner join product using (productId) where warehouseId = '${warehouseId}'
    `);
    itemList =
      "<table id='warehouse-table'><tr><th>Product ID</th><th>Product Name</th><th>Quantity</th><th>Action</th></tr>";
    items.forEach((item, index) => {
      itemList += `<tr><td id='productId-${index}'>${item.productId}</td><td>${item.productName}</td><td>${item.quantity}</td><td><div><button id='deductItemBtn-${index}'>-</button><button id='addItemBtn-${index}'>+</button></div></td></tr>`;
    });
    itemList += "</table>";
  } catch (err) {
    errMsg = err.message;
  }

  res.render("warehouseproduct", {
    title: `Kiet Phan Grocery Store - Warehouse ${warehouseId}`,
    itemList,
    errMsg,
    username: req.session.username,
    warehouseId,
  });
});

const addItemRouter = express.Router({ mergeParams: true });
router.use("/add", addItemRouter);
addItemRouter.route("/").post(async (req, res) => {
  try {
    const productId = req.body.productId;
    const warehouseId = req.body.warehouseId;
    await query(
      `update productinventory set quantity = quantity + 1 where productId = '${productId}' and warehouseId = '${warehouseId}'`
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    console.dir(err);
    res.sendStatus(500);
  }
});

const deductItemRouter = express.Router({ mergeParams: true });
router.use("/deduct", deductItemRouter);
deductItemRouter.route("/").post(async (req, res) => {
  try {
    const productId = req.body.productId;
    const warehouseId = req.body.warehouseId;
    await query(
      `update productinventory set quantity = quantity - 1 where productId = '${productId}' and quantity > 0 and warehouseId = '${warehouseId}'`
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    console.dir(err);
    res.sendStatus(500);
  }
});

module.exports = router;
