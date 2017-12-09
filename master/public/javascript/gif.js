var socket = io.connect('http://localhost:3000');
            $(document).ready(function() {
                $('#searchButton').click(function() {
                    searchGif();
                });
            });
            
            var gifKey = "OUsWjpISlIIZOhQx9uAtVQjOeIUvA2Du";

            var searchGif = function (){

                $("#gifList").empty();
                var searchValue = $('#searchValue').val().split(' ').join('_');

                //javascript, jQuery
                var xhr = $.get("http://api.giphy.com/v1/gifs/search?q="+searchValue+"&api_key="+gifKey+"&limit=5");
                xhr.done(function(data) {

                   $.each(data.data, function( key, value ) {
                      $("#gifList").append(`
                        <li>
                            <img src="`+value.images.fixed_height_small.url+`"
                                onclick=sendGif("` +value.images.fixed_height_small.url+ `")>
                        </li>`);
                    });
                    
                });
            };

            var sendGif = function(url){
                $("#sendGifList").empty();
                $("#sendGifList").append('<li><img src="'+url+'"></li>');
                $("#gifList").empty();
                socket.emit('gifurl',url);
                socket.on('gifurl', function(gif){
                    $("#pis").append('<li><img src="'+gif+'"></li>');
                });
            };


            