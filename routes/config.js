var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/config', function(req, res, next) {
  var config = fs.readFileSync('config.js');
  res.type('application/javascript');
  res.send(config);
});

module.exports = router;
