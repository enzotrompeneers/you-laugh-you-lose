var YouTube = require('youtube-node');

exports.search = function(searchterm, next){
    var youTube = new YouTube();
    youTube.setKey(process.env.G_API_KEY);
    
    youTube.search(searchterm, 10, function(error, result) {
      if (error) {
          console.log(error);
      }
      else {
          next(result);
      }
    });
}