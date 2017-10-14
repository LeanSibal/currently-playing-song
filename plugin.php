<?php
/**
 * Plugin Name: Currently Playing Song Shortcode
 * PluginURI: http://www.renesejling.dk
 * Description: Shows the currently playing song by using the shortcode [currently_playing_song] and [song_playlist]
 * Author: René Sejling
 * Version: 0.0.1
 **/

add_shortcode('currently_playing_song', 'currently_playing_song_shortcode');
function currently_playing_song_shortcode( $atts ) {
    wp_enqueue_script( 'currently_playing_song_script' );
    wp_enqueue_style( 'song_styles' );
    ob_start();
?>
<?php if( !empty( $atts['show'] ) && $atts['show'] == 'current' ) : ?>
    <span id="currently_playing"></span>
<?php elseif ( !empty( $atts['show'] ) && $atts['show'] == 'last' ) : ?>
    <span id="last_played"></span>
<?php endif; ?>
<?php
    return ob_get_clean();
}


add_shortcode( 'songs_playlist', 'songs_playlist_shortcode' );
function songs_playlist_shortcode( $atts ) {
    wp_enqueue_script( 'currently_playing_song_script' );
    ob_start();
?>
<div class="playlist">
    <div class="buttons">
        <select id="songDate">
            <option value="Sunday">Søndag</option>
            <option value="Monday">Mandag</option>
            <option value="Tuesday">Tirsdag</option>
            <option value="Wednesday">Onsdag</option>
            <option value="Thursday">Torsdag</option>
            <option value="Friday">Fredag</option>
            <option value="Saturday">Lørdag</option>
        </select>
        <select id="songTime">
            <option value="24">kl. 00-01</option>
            <option value="1">kl. 01-02</option>
            <option value="2">kl. 02-03</option>
            <option value="3">kl. 03-04</option>
            <option value="4">kl. 04-05</option>
            <option value="5">kl. 05-06</option>
            <option value="6">kl. 06-07</option>
            <option value="7">kl. 07-08</option>
            <option value="8">kl. 08-09</option>
            <option value="9">kl. 09-10</option>
            <option value="10">kl. 10-11</option>
            <option value="11">kl. 11-12</option>
            <option value="12">kl. 12-13</option>
            <option value="13">kl. 13-14</option>
            <option value="14">kl. 14-15</option>
            <option value="15">kl. 15-16</option>
            <option value="16">kl. 16-17</option>
            <option value="17">kl. 17-18</option>
            <option value="18">kl. 18-19</option>
            <option value="19">kl. 19-20</option>
            <option value="20">kl. 20-21</option>
            <option value="21">kl. 21-22</option>
            <option value="22">kl. 22-23</option>
            <option value="23">kl. 23-24</option>
        </select>
    </div>
    <div >
        <table id="songs-playlist">
        </table>
    </div>
</div>
<?php
    return ob_get_clean();
}

add_action('wp_enqueue_scripts', 'enqueue_currently_playing_songs_scripts');
function enqueue_currently_playing_songs_scripts() {
    wp_register_script( 'momentjs', plugins_url('/currently-playing-song/js/moment.min.js' ), [], '2.18.1' );
    wp_register_script( 'moment-timezone', plugins_url('/currently-playing-song/js/moment-timezone.min.js' ), ['momentjs'], '0.5.13' );
    wp_register_script( 'currently_playing_song_script', plugins_url('/currently-playing-song/js/script.js' ), ['momentjs', 'moment-timezone', 'jquery'], '1.0.0' );

    wp_register_style( 'song_styles', plugins_url('/currently-playing-song/css/styles.css') );
}
