<?
	get_header();
	/* Template Name: Главная */
?>

<div class="container flex">
	<? 
		for ($i=0; $i < 5; $i++) { 
			?>
					<div class="block" style="width: 100px; height: 100px; background: #ccc;"></div>
			<?
		}
	?> 
	<div class="text-block"> 
		<? the_content(); ?>  
	</div>
</div> 

<?
	get_footer();
?>
 