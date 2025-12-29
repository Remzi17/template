<?

show_admin_bar(false);

$includes = [
	'setup.php',
	'scripts.php',
	'post-types.php', 
	'request.php', 
	'helpers.php',
	'admin.php',
	'other.php'
];

foreach ($includes as $file) {
	$path = get_template_directory() . '/inc/' . $file;
	if (file_exists($path)) {
		require_once $path;
	}
}
