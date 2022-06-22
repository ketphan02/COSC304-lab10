const express = require("express");
const router = express.Router();
const moment = require("moment");
const getQuery = require("../utils/getQuery");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.write("<title>Kiet Phan Grocery Order List</title>");

  /** Create connection, and validate that it connected successfully **/
  const query = getQuery();
  const result = await query(
    `select orderId, orderDate, totalAmount, shiptoAddress as address, shiptoCity as city, shiptoState as state, shiptoPostalCode as zip, shiptoCountry as country, customerId from ordersummary`
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

  /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

  /** Write query to retrieve all order headers **/

  /** For each order in the results
            Print out the order header information
            Write a query to retrieve the products in the order

            For each product in the order
                Write out product information 
    **/

  res.end();
});

module.exports = router;
