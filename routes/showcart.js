const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  let productList = false;
  const rmItem = req?.query?.rmItem;
  const addItem = req?.query?.addItem;
  const reduceItem = req?.query?.reduceItem;

  res.setHeader("Content-Type", "text/html");
  res.write("<title>Your Shopping Cart</title>");
  if (req.session.productList) {
    productList = req.session.productList;
    if (rmItem) {
      productList[rmItem] = null;
    } else if (addItem) {
      productList[addItem].quantity = productList[addItem].quantity + 1;
      productList[addItem].total =
        productList[addItem].price * productList[addItem].quantity;
    } else if (reduceItem) {
      productList[reduceItem].quantity = productList[reduceItem].quantity - 1;
      productList[reduceItem].total =
        productList[reduceItem].price * productList[reduceItem].quantity;
    }
  }

  let flag = false;
  for (let key in productList) {
    if (productList[key]) {
      flag = true;
    }
  }

  if (flag) {
    res.write("<h1>Your Shopping Cart</h1>");
    res.write(
      "<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th>"
    );
    res.write("<th>Price</th><th>Subtotal</th></tr>");

    let total = 0;
    for (const product of productList) {
      if (!product) {
        continue;
      }

      res.write("<tr><td>" + product.id + "</td>");
      res.write("<td>" + Buffer.from(product.name, 'base64').toString() + "</td>");

      res.write('<td align="center">' + product.quantity + "</td>");

      res.write(
        '<td align="right">$' + Number(product.price).toFixed(2) + "</td>"
      );
      res.write(
        '<td align="right">$' +
          (Number(product.quantity.toFixed(2)) * Number(product.price)).toFixed(
            2
          ) +
          "</td>"
      );
      // add button to reduce quantity of product
      if (product.quantity > 1) {
        res.write(
          `<td align="right"><button onclick="window.location='/showcart?reduceItem=${product.id}'">-</button></td>`
        );
      } else {
        res.write(
          `<td align="right"><button disabled>-</button></td>`
        );
      }
      res.write(
        `<td align="right"><button onclick="window.location='/showcart?addItem=${product.id}'">+</button></td>`
      );

      res.write(
        `<td align="right"><button onclick="window.location='/showcart?rmItem=${product.id}'">Remove</button></td></tr>`
      );
      res.write("</tr>");
      total = total + product.quantity * product.price;
    }
    res.write(
      '<tr><td colspan="4" align="right"><b>Order Total</b></td><td align="right">$' +
        total.toFixed(2) +
        "</td></tr>"
    );
    res.write("</table>");

    res.write('<h2><a href="checkout">Check Out</a></h2>');
  } else {
    res.write("<h1>Your shopping cart is empty!</h1>");
  }
  res.write('<h2><a href="listprod">Continue Shopping</a></h2>');

  res.end();
});

module.exports = router;
