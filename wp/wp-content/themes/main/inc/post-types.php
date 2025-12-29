<? 

// Отрасли
register_post_type('solutions', array (
	'labels' => array (
		'name' => 'Отрасли',
		'singular_name' => 'Отрасли',
		'add_new' => 'Добавить отрасль',
		'add_new_item' => 'Добавить новую отрасль',
		'edit_item' => 'Редактировать отрасль',
		'new_item' => 'Новая отрасль',
		'view_item' => 'Просмотреть отрасль',
		'search_items' => 'Найти отрасль',
		'not_found' =>  'Отраслей не найдено',
		'not_found_in_trash' => 'В корзине отраслей не найдено',
		'parent_item_colon' => '',
		'menu_name' => 'Отрасли',
		'featured_image'        => 'Изображение отрасли',
		'set_featured_image'    => 'Загрузить фото',
		'remove_featured_image' => 'Удалить фото',
		'use_featured_image'    => 'Использовать как фото'
	), 
	'public' => true,
	'menu_position' => 5,
	'menu_icon' => 'dashicons-clipboard',
	'supports' => array ('title', 'editor', 'excerpt', 'thumbnail', 'custom-field'),
));

// Услуги
register_post_type('services', array (
	'labels' => array (
		'name' => 'Услуги',
		'singular_name' => 'Услуги',
		'add_new' => 'Добавить услугу',
		'add_new_item' => 'Добавить новую услугу',
		'edit_item' => 'Редактировать услугу',
		'new_item' => 'Новая услуга',
		'view_item' => 'Просмотреть услугу',
		'search_items' => 'Найти услугу',
		'not_found' =>  'Услуг не найдено',
		'not_found_in_trash' => 'В корзине услуг не найдено',
		'parent_item_colon' => '',
		'menu_name' => 'Услуги',
		'featured_image'        => 'Изображение услуги',
		'set_featured_image'    => 'Загрузить фото',
		'remove_featured_image' => 'Удалить фото',
		'use_featured_image'    => 'Использовать как фото'
	), 
	'public' => true,
	'menu_position' => 5,
	'menu_icon' => 'dashicons-admin-tools',
	'supports' => array ('title', 'editor', 'excerpt', 'thumbnail', 'custom-field'),
));
