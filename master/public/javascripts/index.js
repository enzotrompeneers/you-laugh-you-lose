function ytSearch() {
    $.get("http://localhost:3000/search/" + $('#youtube-search').val(), function(data, status){
        console.log(data.items);
        $.each( data.items, function( key, value ) {
            $video_id = data.items[key].id.videoId;
            $video_thumb = data.items[key].snippet.thumbnails.medium.url;
            $( "<img class='"+ $video_id +"' src='" + $video_thumb + "' />" ).appendTo( ".thumbnail-wrapper" );
            console.log("youtube url= https://www.youtube.com/watch?v="+ $video_id + "?autoplay=1");
          });
    });

    

    

}

$(function() {
    
$( ".thumbnail-wrapper" ).on( "click", 'img', function() {
    
    var $video_id = $(this).attr('class');
    $('.thumbnail-wrapper').hide();
    $( "<iframe width='560' height='315' src='//www.youtube.com/embed/" + $video_id + "'frameborder='0' gesture='media' allow='encrypted-media' allowfullscreen</iframe>" ).appendTo( ".iframe-wrapper" );
  });

});


