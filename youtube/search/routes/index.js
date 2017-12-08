var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var YouTube = require('youtube-node');
/* GET searchterms (ajax request) */
router.get('/search/:searchterm', function(req, res, next) {
  var youTube = new YouTube();
  youTube.setKey(process.env.G_API_KEY);

  youTube.search(req.params.searchterm, 10, function(error, result) {
    if (error) {
        console.log(error);
    }
    else {
        res.json(result);
    }
  });
});


module.exports = router;