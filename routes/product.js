const express = require("express");
const router = express.Router();
const { getQuery } = require("../utils/getQuery");

router.get("/", async (req, res) => {
  const productId = parseInt(req.query.productId);
  const username = req.session.username;
  try {
    const query = getQuery();
    // write query
    const result = (
      await query(`select * from product where productid=${productId} limit 1`)
    )[0];

    const productName = result.productName;
    let productImage = "";
    if (result.productImageURL) {
      productImage += `<img src="${result.productImageURL}">`;
    }
    if (result.productImage) {
      productImage += `<img src="displayImage?productId=${productId}">`;
    }

    const productDescription = result.productDesc;
    const productPrice = result.productPrice;

    const cartURL = encodeURI(
      `/addcart?id=${productId}&name=${Buffer.from(productName).toString(
        "base64"
      )}&price=${productPrice}`
    );
    const addToCart = `<input type="button" value="Add to Cart" onclick="window.location.href='${cartURL}'"/>`;
    const continueShopping = `<input type="button" value="Continue Shopping" onclick="window.location.href='/listprod'"/>`;

    let canAddReview = false;
    let customerId;
    try {
      if (username) {
        customerId = (await query(
          `select customerId from customer where userid='${username}'`
        ))[0].customerId;

        const numReviews = (
          await query(
            `select count(*) as numReviews from review where productId=${productId} and customerId=${customerId}`
          )
        )[0].numReviews;
        const numBought = (
          await query(
            `select count(*) as numBought from orderproduct inner join ordersummary using (orderId) where productId=${productId} and customerId=${customerId}`
          )
        )[0].numBought;
        if (numReviews < numBought) {
          canAddReview = true;
        }
      }
    } catch (_) {
      canAddReview = false;
    }

    const reviews = [];
    const allReviews = (
      await query(
        `select reviewRating, reviewComment, userid from review inner join customer using (customerId) where productId=${productId} order by reviewDate desc`
      )
    );
    allReviews.forEach((row) => {
      reviews.push({
        username: row.userid,
        star: row.reviewRating,
        review: row.reviewComment,
      });
    });

    res.render("product", {
      username: req.session.username,
      productName,
      productImage,
      productDescription,
      productId,
      productPrice,
      addToCart,
      continueShopping,
      canAddReview,
      reviews,
      customerId
    });
  } catch (err) {
    console.dir(err);
  }
});

module.exports = router;
