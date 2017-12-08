function ytSearch() {
    $.get("http://localhost:3000/search/" + $('#youtube-search').val(), function(data, status){
        console.log(data.items);
        $.each( data.items, function( key, value ) {
            $video_id = data.items[key].id.videoId;
            $video_thumb = data.items[key].snippet.thumbnails.high.url;

            $( "<img src='" + $video_thumb + "' />" ).appendTo( ".thumbnail-wrapper" );
            console.log("youtube url= https://www.youtube.com/watch?v="+ $video_id);
            
          });
    });
}