jQuery( document ).ready(function($){
    var fetchSongs = function() {
        $.getJSON('https://radiostreaming.dk/radioapp/app/?action=playlists&radio_id=34&station=default', 
            function( songs ){
                if( songs.length < 1 ) return false;
                var currentTime = 0;
                var currentSong = null;
                for( i in songs ) {
                    var date = moment( songs[i].date + ' ' + songs[i].time + ' +01', 'YYMMDD HH:mm +-HH').valueOf();
                    if( date > currentTime ){
                        currentTime = date;
                        currentSong = songs[i];
                    }
                }
                if( typeof currentSong.title !== 'undefined' && typeof currentSong.artist !== 'undefined' ) {
                    $("#currently_playing span").text( currentSong.artist + ": " + currentSong.title );
                }
            }
        );
    };
    fetchSongs();
    setTimeout(fetchSongs, 30000);
});
