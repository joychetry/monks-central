<?php
// Monks Central acceptance fixture: offers MC Broken Update 1.1 from a zip next to this file.
add_filter( 'site_transient_update_plugins', function ( $t ) {
	$file = 'mc-broken-update/mc-broken-update.php';
	if ( ! is_object( $t ) ) {
		$t = new stdClass();
	}
	$t->response[ $file ] = (object) array(
		'slug'        => 'mc-broken-update',
		'plugin'      => $file,
		'new_version' => '1.1',
		'package'     => 'mc-broken-update-1.1.zip',
		'url'         => '',
	);
	return $t;
} );
// The upgrader deletes the package after unzipping, so hand it a copy.
add_filter( 'upgrader_pre_download', function ( $reply, $package ) {
	if ( 'mc-broken-update-1.1.zip' !== $package ) {
		return $reply;
	}
	$tmp = wp_tempnam( 'mc-broken-update' );
	copy( __DIR__ . '/mc-broken-update-1.1.zip', $tmp );
	return $tmp;
}, 10, 2 );
