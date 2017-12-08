function ytSearch() {
    $.get("http://localhost:3000/search/" + $('#youtube-search').val(), function(data, status){
        console.log(data);
    });
}