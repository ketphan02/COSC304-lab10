const express = require("express");
const router = express.Router();
const moment = require("moment");
const { getQuery, getConnection } = require("../utils/getQuery");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.write("<title>Kiet Phan Grocery Order List</title>");

  /** Create connection, and validate that it connected successfully **/

  const conn = getConnection();
  const query = getQuery(conn);
  const result = await query(
    `select orderId, orderDate, totalAmount, shiptoAddress as address, shiptoCity as city, shiptoState as state, shiptoPostalCode as zip, shiptoCountry as country, customerId from ordersummary inner join customer using (customerId) where userid='${req.session.username}'`
  );

  if (!result) {
    res.write("<h1>No orders found</h1>");
  } else {
    res.write(
      "<table><tr><th>Order ID</th><th>Order Date</th><th>Total Amount</th><th>Customer ID</th></tr>"
    );

    result.forEach((row) => {
      res.write(
        `<tr>
          <td>${row.orderId}</td>
          <td>${moment(row.orderDate).format("dddd, MMMM Do YYYY")}</td>
          <td>\$${row.totalAmount}</td>
          <td>${row.customerId}</td>
        </tr>`
      );
    });

    res.write("</table>");
  }

  res.end();
  conn.end();
});

module.exports = router;
