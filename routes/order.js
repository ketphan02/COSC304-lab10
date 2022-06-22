const express = require("express");
const router = express.Router();
const { getQuery } = require("../utils/getQuery");

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const username = req.session.username;
  if (!username) {
    res.redirect("/login");
  }

  let productList = false;
  if (req.session.productList && req.session.productList.length > 0) {
    productList = req.session.productList;
  }
  const query = getQuery(productList);
  /**
    Determine if valid customer id was entered
    Determine if there are products in the shopping cart
    If either are not true, display an error message
    **/
  let hasItemInCart = false;
  let totalAmount = 0;
  for (let key in productList) {
    if (productList[key]) {
      hasItemInCart = true;
      totalAmount += productList[key].quantity * productList[key].price;
    }
  }
  console.log(hasItemInCart);

  let errMsg, resultMsg, customerId;
  try {
    const customerId = (
      await query(`select customerId from customer where userId='${username}'`)
    )[0].customerId;
    if (hasItemInCart && customerId) {
      await query(
        `insert into ordersummary (
              orderDate,
              totalAmount,
              shiptoAddress,
              shiptoCity,
              shiptoState,
              shiptoPostalCode,
              shiptoCountry,
              customerId,
              shipmentId
          ) values (
              now(),
              '${totalAmount.toFixed(2)}',
              null, null, null, null, null,
              '${customerId}',
              null)`
      );
      const last_insert_id = (
        await query(`SELECT LAST_INSERT_ID() as last_insert_id`)
      )[0].last_insert_id;
      for (let key in productList) {
        if (productList[key]) {
          await query(
            `insert into orderproduct (
                  orderId,
                  productId,
                  quantity,
                  price
                  ) values (
                    '${last_insert_id}',
                    '${key}',
                    '${productList[key].quantity}',
                    '${productList[key].price}'
                    )`
          );
        }
      }
      resultMsg = "";
      resultMsg += `<h1>Your Order has been placed. Your order id: ${last_insert_id}</h1>`;
      resultMsg += "<h2>Your order summary:</h2><br>";
      resultMsg +=
        "<table class='orderTable'><tr><th>Product</th><th>Quantity</th><th>Price</th></tr>";
      for (let key in productList) {
        if (productList[key]) {
          resultMsg += `<tr>
              <td>${Buffer.from(
                productList[key].name,
                "base64"
              ).toString()}</td>
              <td>${productList[key].quantity}</td>
              <td>\$${productList[key].price}</td>
            </tr>`;
        }
      }
      resultMsg += "</table>";
      resultMsg += "<a href='/listprod'><h1>Go back to order page</h1></a>";
      resultMsg += `<a href="/"><h1>Return to Home</h1></a>`;
      req.session.productList = undefined;
    }
  } catch (err) {
    errMsg = `<h1>Error: ${err}</h1>`;
  } finally {
    res.render("order", {
      username,
      customerId: customerId ? undefined : customerId,
      hasItemInCart: hasItemInCart ? undefined : hasItemInCart,
      resultMsg,
      errMsg,
    });
  }
});

module.exports = router;
