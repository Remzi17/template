<? 
 
// Страница с опциями 
if (function_exists('acf_add_options_page')) {
	acf_add_options_page([
		'page_title'  => 'Контакты',
		'menu_title'  => 'Контакты',
		'menu_slug'   => 'contact',
		'capability'  => 'edit_posts',
		'redirect'    => false,
		'position'    => 1,
	]);
}


// Меню
add_action('after_setup_theme', function() {
	register_nav_menus([
		'header' => 'Шапка'	
	]);

	// add_image_size('mobile-size', 500, 220, true); 
	// add_theme_support('post-thumbnails', ['services']);
});
