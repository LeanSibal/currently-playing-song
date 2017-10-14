moment.tz.add(["Europe/Copenhagen|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 Tz0 VuO0 60q0 WM0 1fA0 1cM0 1cM0 1cM0 S00 1HA0 Nc0 1C00 Dc0 1Nc0 Ao0 1h5A0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5"]);
var allSongs = [];
function fetchSongsByDate( day, time, callback ) {
    jQuery.getJSON('https://radiostreaming.dk/radioapp/app/?action=playlists&radio_id=34&station=default&day=' + day + '&time=' + time , callback );
}
function fetchItunesAlbumArt( artist, title, song, callback ) {
        jQuery.getJSON('http://itunes.apple.com/search?entity=song&limit=1&term=' + artist, 
            function( albumart ) {
                callback( song, albumart );
            }
        );
}
var playlist = [];
function addSongToPlaylist( song ) {
    playlist.push( song );
    playlist.sort( function( a, b ) {
        var left = new Date( 2017, 01, 01, a.time.substr( 0, 2 ), a.time.substr( 3, 2 ) ),
            right = new Date( 2017, 01, 01, b.time.substr( 0, 2 ), b.time.substr( 3, 2 ) );
        if( left < right ) return -1;
        if( left > right ) return 1;
        return 0;
    });
    layoutSongTable( playlist );
}

function layoutSongTable( playlist ) {
    const tableRow = ({ albumArt, artist, title, time }) => `
        <tr>
            <td>
                <img src="${albumArt}"/>
            </td>
            <td>
                <span>${time}</span>
            </td>
            <td>
                <span>${artist}</span>
            </td>
            <td>
                <span>${title}</span>
            </td>
        </tr>
    `;
    jQuery('#songs-playlist').html( playlist.map( tableRow ).join('') );
}
jQuery( document ).ready(function($){
    if( jQuery('.playlist').length > 0 ) {
        jQuery('#songDate').val( moment.tz("Europe/Copenhagen").format('dddd') );
        jQuery('#songTime').val( moment.tz("Europe/Copenhagen").format('H') );
        var updatePlaylist = function() {
            playlist = [];
            var day = jQuery('#songDate').val();
            var hour = jQuery('#songTime').val();
            fetchSongsByDate( day, hour, function( songs ) {
                for( var i in songs ) {
                    var artist = songs[i].artist;
                    var title = songs[i].title;
                    fetchItunesAlbumArt( artist, title, songs[i], function( song, albumart ) {
                        var link = '#'
                        if( albumart.resultCount > 0 ) {
                            link = albumart.results[0].artworkUrl100;
                        }
                        addSongToPlaylist({
                            artist: song.artist,
                            title: song.title,
                            time: song.time,
                            albumArt: link
                        });
                    } );
                }
            });
        }
        updatePlaylist();
        jQuery('#songDate').change( updatePlaylist );
        jQuery('#songTime').change( updatePlaylist );
    }


    if( $('#currently_playing').length > 0 ) {
        var fetchSongs = function() {
            var day = moment.utc().format("dddd");
            $.getJSON('https://radiostreaming.dk/radioapp/app/?action=playlists&radio_id=34&station=default', 
                function( songs ){
                    console.log( songs );
                    if( songs.length < 1 ) return false;
                    var currentTime = 0;
                    var currentSong = null;
                    var playingLast = null;
                    for( i in songs ) {
                        var date = moment( songs[i].date + ' ' + songs[i].time + ' +01', 'YYMMDD HH:mm +-HH').valueOf();
                        if( date > currentTime ){
                            currentTime = date;
                            playingLast = currentSong;
                            currentSong = songs[i];
                        }
                    }
                    if( typeof currentSong.title !== 'undefined' && typeof currentSong.artist !== 'undefined' ) {
                        $("#currently_playing").html( currentSong.artist + ": " + currentSong.title );
                        $("#last_played").html( playingLast.artist + ": " + playingLast.title );
                    }
                }
            );
        };
        fetchSongs();
        setTimeout(fetchSongs, 30000);
    }
});
