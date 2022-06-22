const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    // check if logged in
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        res.redirect('/order');
    }
});

module.exports = router;
