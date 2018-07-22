var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/view', function(req, res, next) {
    console.log(req);
});

module.exports = router;
