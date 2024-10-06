<?php
/**
 * File which demonstrate how to add Dialog Easy scripts in wp-admin.
 *
 * @package easy-dialog-for-wordpress
 */

/**
 * Add the scripts and styles of Easy Dialog for WordPress in the plugin / theme.
 *
 * Change function name to match your custom slug.
 */
add_action( 'admin_enqueue_scripts', 'custom_dialog_embed' );
function custom_dialog_embed(): void {
    // define paths: adjust if necessary.
    $path = trailingslashit(plugin_dir_path(__FILE__)).'vendor/threadi/easy-dialog-for-wordpress/';
    $url = trailingslashit(plugin_dir_url(__FILE__)).'vendor/threadi/easy-dialog-for-wordpress/';

    // bail if path does not exist.
    if( !file_exists($path) ) {
        return;
    }

    // get assets path.
    $script_asset_path = $path . 'build/index.asset.php';

    // bail if assets does not exist.
    if( !file_exists($script_asset_path) ) {
        return;
    }

    // embed the dialog-components JS-script.
    $script_asset      = require( $script_asset_path );
    wp_enqueue_script(
        'easy-dialog-for-wordpress',
        $url . 'build/index.js',
        $script_asset['dependencies'],
        $script_asset['version'],
        true
    );

    // embed the dialog-components CSS-script.
    $admin_css      = $url . 'build/style-index.css';
    $admin_css_path = $path . 'build/style-index.css';
    wp_enqueue_style(
        'easy-dialog-for-wordpress',
        $admin_css,
        array( 'wp-components' ),
        filemtime( $admin_css_path )
    );
}
