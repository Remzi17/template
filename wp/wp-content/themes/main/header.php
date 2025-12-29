<!DOCTYPE html>
<html lang="ru">

<head>

	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<!-- Шрифты --> 
	<link rel="preload" href="<?=get_template_directory_uri()?>/assets/css/fonts.css" as="font" onload="this.rel='stylesheet' ">

	<title><? bloginfo('name'); wp_title()?></title>

	<?
		wp_head();
	?>
	
</head>

<body id="home" <? body_class('wp')?>>
	<div class="wrapper">
		
		<header>
		</header>

		<main class="main">
