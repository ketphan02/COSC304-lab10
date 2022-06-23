const express = require("express");
const router = express.Router();
const { getQuery, getConnection } = require("../utils/getQuery");

router.get("/", async (req, res) => {
  // Get the product name to search for
  let name = req.query.productName?.trim();
  let category = req.query.productCategory?.trim();

  /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

  const conn = getConnection();
  const query = getQuery(conn);
  try {
    let baseQuery = `select productId, productName, productPrice from product inner join category using (categoryId)`;
    const nameQuery = name && `productName like '%${name}%'`;
    const categoryQuery = category && `categoryName like '%${category}%'`;
    if (nameQuery && categoryQuery) {
      baseQuery += ` where ${nameQuery} and ${categoryQuery};`;
    } else if (nameQuery) {
      baseQuery += ` where ${nameQuery};`;
    } else if (categoryQuery) {
      baseQuery += ` where ${categoryQuery};`;
    } else {
      baseQuery += ";";
    }
    const result = await query(baseQuery);

    let listProdHeader = "";
    let productTable = "";
    if (result.length === 0) {
      listProdHeader += "<h2>No products found</h2>";
    } else {
      listProdHeader += `<h2>${result.length} products found</h2>`;
      productTable +=
        "<table class='productTable'><tr><th>Product ID</th><th>Product Name</th><th>Product Price</th><th>Action</th></tr>";
      result.forEach((row) => {
        const productId = row.productId;
        const productName = row.productName;
        const productPrice = parseFloat(row.productPrice).toFixed(2);

        const cartURL = encodeURI(
          `/addcart?id=${productId}&name=${Buffer.from(productName).toString(
            "base64"
          )}&price=${productPrice}`
        );
        const productURL = encodeURI(`/product?productId=${productId}`);
        productTable += `
        <tr>
          <td>${productId}</td>
          <td><a href="${productURL}">${productName}</a></td>
          <td>\$${productPrice}</td>
          <td><input type="button" value="Add to Cart" onclick="window.location.href='${cartURL}'"/></td>
        </tr>`;
      });
      productTable += "</table>";
    }

    res.render("listprod", {
      username: req.session.username,
      listProdHeader,
      productTable,
    });
  } catch (err) {
    console.error(err);
  }
  conn.end();
});

module.exports = router;
