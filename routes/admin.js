const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../auth");
const { getQuery } = require("../utils/getQuery");
const moment = require("moment");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (req.session.username) {
    try {
      res.render("admin", {
        title: "Administrators",
        username: req.session.username,
      });
    } catch (err) {
      console.dir(err);
    }
  } else {
    auth.checkAuthentication(req, res);
  }
});

const salesReportRouter = express.Router({ mergeParams: true });
router.use("/salereport", salesReportRouter);
salesReportRouter.route("/").get(async (req, res) => {
  if (req.session.username) {
    try {
      const query = getQuery();
      const result = await query(
        `select sum(totalAmount) as totalOrderedAmount, date(orderDate) as orderDate from ordersummary group by date(orderDate)`
      );
      let orderTable = "<table><th>Order Date</th><th>Total Order Amount</th>";
      const values = [];
      const labels = [];
      result.forEach((row) => {
        const formatDate = moment(row.orderDate).format("YYYY-MM-DD");
        orderTable += `<tr><td>${formatDate}</td><td>${row.totalOrderedAmount}</td></tr>`;
        labels.push(formatDate.toString());
        values.push(parseInt(row.totalOrderedAmount));
      });
      orderTable += "</table>";

      const graph = `
        <script>
        new Chart('myChart', {
          type: 'line',
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
              data: ${JSON.stringify(values)},
              lineTension: 0,
              backgroundColor: "rgba(0,0,255,1.0)",
              borderColor: "rgba(0,0,255,0.1)",
              label: 'Total Order Amount'
            }],
          },
          options: {}
      });
      </script>
      `;

      res.render("admin-template", {
        title: "Administrators Sales Report by Day",
        content: orderTable,
        username: req.session.username,
        graph,
      });
    } catch (err) {
      console.dir(err);
    }
  } else {
    auth.checkAuthentication(req, res);
  }
});

const allCustomerRouter = express.Router({ mergeParams: true });
router.use("/allcustomer", allCustomerRouter);
allCustomerRouter.route("/").get(async (req, res) => {
  if (req.session.username) {
    try {
      const query = getQuery();
      const result = await query(`select * from customer`);
      let customerTable =
        "<table><th>Customer ID</th><th>Customer Name</th><th>Customer Phone</th><th>Customer Email</th>";
      result.forEach((row) => {
        customerTable += `<tr><td>${row.customerId}</td><td>${
          row.firstName + " " + row.lastName
        }</td><td>${row.phonenum}</td><td>${row.email}</td></tr>`;
      });
      customerTable += "</table>";
      res.render("admin-template", {
        title: "Administrators All Customer",
        content: customerTable,
        username: req.session.username,
      });
    } catch (err) {
      console.dir(err);
    }
  } else {
    auth.checkAuthentication(req, res);
  }
});

const productRouter = express.Router({ mergeParams: true });
router.use("/allproduct", productRouter);
productRouter.route("/").get(async (req, res) => {
  if (!req.session.username) {
    auth.checkAuthentication(req, res);
  }
  try {
    const query = getQuery();
    const result = await query(`select * from product`);
    let productTable =
      "<table><tr><th>Product ID</th><th>Product Name</th><th>Product Price</th><th>Remove</th></tr>";
    result.forEach((row) => {
      productTable += `<tr><td>${row.productId}</td><td>${row.productName}</td><td>${row.productPrice}</td><td><button onclick="window.location.href='/admin/allproduct/remove/${row.productId}'">Remove</button></td></tr>`;
    });
    productTable += "</table>";
    productTable += `
    <button type="button" onclick="window.location.href='/admin/allproduct/add'">Add Product</button>
    `;
    res.render("admin-template", {
      title: "Administrators All Product",
      content: productTable,
      username: req.session.username,
    });
  } catch (err) {
    console.dir(err);
  }
});

productRouter.route("/add").get(async (req, res) => {
  if (!req.session.username) {
    auth.checkAuthentication(req, res);
  }
  res.render("admin-template", {
    title: "Administrators Add Product",
    content: `
    <form id="product-add-form" action="/admin/allproduct/add" method="post">
      <label for="productName">Product Name</label>
      <input type="text" name="productName" id="productName" required>
      <label for="productPrice">Product Price</label>
      <input type="number" name="productPrice" id="productPrice" required>
      <label for="productDescription">Product Description</label>
      <textarea name="productDescription" id="productDescription" cols="30" rows="10" required></textarea>
      <input type="submit" value="Add Product">
    </form>
    `,
    username: req.session.username,
  });
});

productRouter.route("/add").post(async (req, res) => {
  if (!req.session.username) {
    auth.checkAuthentication(req, res);
  }
  try {
    const productName = req.body.productName;
    const productPrice = parseInt(req.body.productPrice);
    const productDescription = req.body.productDescription || "";
    const productImageURL = req.body.productImageURL || "";

    const query = getQuery();
    if (productPrice > 0) {
      await query(
        `insert into product (productName, productPrice, productDesc, productImageURL) values ('${productName}', ${productPrice}, '${productDescription}', '${productImageURL}')`
      );
      res.redirect("/admin/allproduct");
    }
  } catch (err) {
    console.dir(err);
  }
});

productRouter.route("/remove/:productId").get(async (req, res) => {
  if (!req.session.username) {
    auth.checkAuthentication(req, res);
  }
  try {
    const productId = req.params.productId;
    const query = getQuery();
    await query(`delete from product where productId = '${productId}'`);
  } catch (err) {
    console.dir(err);
  }
  res.redirect("/admin/allproduct");
});

module.exports = router;
