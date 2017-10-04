<?php
/**
 * Plugin Name: Currently Playing Song Shortcode
 * PluginURI: http://www.renesejling.dk
 * Description: Shows the currently playing song by using the shortcode [currently_playing_song]
 * Author: René Sejling
 * Version: 0.0.1
 **/

add_shortcode('currently_playing_song', 'currently_playing_song_shortcode');
function currently_playing_song_shortcode( $atts ) {
    wp_enqueue_script( 'currently_playing_song_script' );
    wp_enqueue_style( 'song_styles' );
    ob_start();
?>
<div class="currently_playing_song">
    <div><span id="currently_playing"></span></div>
    <div><span id="playing_last"></span></div>
</div>
<?php
    return ob_get_clean();
}

add_action('wp_enqueue_scripts', 'enqueue_currently_playing_songs_scripts');
function enqueue_currently_playing_songs_scripts() {
    wp_register_script( 'momentjs', plugins_url('/currently-playing-song/js/moment.min.js' ), [], '2.18.1' );
    wp_register_script( 'currently_playing_song_script', plugins_url('/currently-playing-song/js/script.js' ), ['momentjs', 'jquery'], '1.0.0' );

    wp_register_style( 'song_styles', plugins_url('/currently-playing-song/css/styles.css') );
}
