const express = require("express");
const router = express.Router();
const { getQuery } = require("../utils/getQuery");

router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "image/jpeg");

  const productId = req.body.productId;
  const customerId = req.body.customerId;
  const rating = parseInt(req.body.rating);
  const review = req.body.review;

  console.log(rating);
  try {
    const query = getQuery();

    // data validation
    if (!(1 <= rating && rating <= 5)) {
      throw new RangeError("Rating must be between 1 and 5");
    }
    if (review.length < 1) {
      throw new RangeError("Review must be at least 1 character");
    }

    // insert review
    await query(
      `insert into review (reviewRating, reviewDate, customerId, productId, reviewComment) values (${rating}, now(), '${customerId}', '${productId}', '${review}')`
    );
    res.redirect("/product?productId=" + productId);
  } catch (err) {
    console.error(err);
    console.dir(err);
  }
});

module.exports = router;
