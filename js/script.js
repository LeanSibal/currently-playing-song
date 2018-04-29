moment.tz.add(["Europe/Copenhagen|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 Tz0 VuO0 60q0 WM0 1fA0 1cM0 1cM0 1cM0 S00 1HA0 Nc0 1C00 Dc0 1Nc0 Ao0 1h5A0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5"]);
var allSongs = [];
function fetchSongsByDate( day, time, callback ) {
    jQuery.getJSON('http://radio-playlists.jfmedier.dk/playlist/json?station=classic&day=' + day + '&time=' + time , callback );
}
function fetchItunesAlbumArt( artist, title, song, callback ) {
	trySongAndArtist( song, callback ); 
}
function trySongAndArtist( song, callback ) {
	jQuery.getJSON('http://itunes.apple.com/search?entity=song&limit=1&term=' + song.artist + '%20-%20' + song.title,
		function ( albumart ) {
			if( albumart.resultCount > 0 ) {
				callback( song, albumart );
			} else {
				trySongAndCountry( song, callback );
			}
		}
	);
}

function trySongAndCountry( song, callback ) {
	jQuery.getJSON('http://itunes.apple.com/search?entity=song&limit=1&country=dk&term=' + song.title,
		function ( albumart ) {
			if( albumart.resultCount > 0 ) {
				callback( song, albumart );
			} else {
				tryArtist( song, callback );
			}
		}
	);
}
function tryArtist( song, callback ) {
	jQuery.getJSON('http://itunes.apple.com/search?entity=song&limit=1&term=' + song.title,
		function ( albumart ) {
			if( albumart.resultCount > 0 ) {
				callback( song, albumart );
			} else {
			}
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
var currentlyPlaying = {
    currentTime: null,
    currentDay: null,
    deductor: 0,
    init: function(){
        this.currentDay = moment.tz("Europe/Copenhagen").format('dddd');
        this.currentTime = moment.tz("Europe/Copenhagen").format('H');
        this.getCurrentSong();
    },
    getCurrentSong: function(){
        this.getSongByDateAndTime( this.currentDay, this.currentTime );
    },
    getSongByDateAndTime: function( day, time ){
        jQuery.getJSON('http://radio-playlists.jfmedier.dk/playlist/json?station=classic&day=' + day + '&time=' + time, 
            function( song ) {
                if( typeof song[0] !== 'undefined' && typeof song[0].title !== 'undefined' && song[0].title.length == 0 ) {
                    this.deductor++;
                    this.currentDay = moment.tz("Europe/Copenhagen").subtract( this.deductor, "hour").format('dddd');
                    this.currentTime = moment.tz("Europe/Copenhagen").subtract( this.deductor, "hour").format('H');
                    this.getSongByDateAndTime( this.currentDay, this.currentTime );
                } else if( typeof song[0] !== 'undefined' && typeof song[0].title !== 'undefined' && song[0].title.length > 0 ) {
                    this.setSong( song );
                }
            }.bind( this )
        );
    },
    setSong: function( song ) {
        song = song.filter( function( song ){
            var date = moment.tz( ( moment( song.date + ' ' + song.time, 'YYMMDD HH:mm').format('YYYY-MM-DD HH:mm') ), "Europe/Copenhagen" ).unix();
            var currentDate = moment.tz("Europe/Copenhagen").unix();
            song.offset = currentDate - date;
            if( song.offset > 0 ) {
                return true;
            } else {
                return false;
            }
        });
        song = song.sort( function( a, b ) {
            if( a.offset < b.offset ) {
                return -1
            } else if ( a.offset > b.offset ) {
                return 1
            } else {
                return 0;
            }
        });
        this.setCurrentlyPlaying( song[0] );
        this.setLastPlayed( song[1] );
    },
    setCurrentlyPlaying: function( song ) {
        jQuery('#currently_playing').html( song.artist + ": " + song.title );
    },
    setLastPlayed: function( song ) {
        jQuery("#last_played").html( song.artist + ": " + song.title );
    }

};
function fixChars( text ) {
	var replacements = {
		'Ã¸' : 'ø',
		'Ã¶' : 'ö',
		'Ã¥' : 'å'
	}
	for( var i in replacements ) {
		text = text.replace(i, replacements[i] );
	}
	return text;
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
					songs[i].artist = fixChars( songs[i].artist );
					songs[i].title = fixChars( songs[i].title );
                    fetchItunesAlbumArt( songs[i].artist, songs[i].title, songs[i], function( song, albumart ) {
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
    if( ( $('#currently_playing').length > 0 || $('#last_played').length > 0 ) && typeof currentlyPlaying !== 'undefined' ) {
        currentlyPlaying.init();
    }
});

