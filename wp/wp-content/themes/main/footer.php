</main> 

<footer class="footer">
</footer> 

</div> <!-- close .wrapper -->

<div class="popups">
	<!-- Заказать звонок -->
	<div class="popup popup-call" id="popup-call">
		<div class="popup__dialog">
			<div class="popup__content">
				<button class="popup__close" data-popup-close>
					<svg class='close'>
						<use xlink:href="<?=get_template_directory_uri()?>/assets/img/sprite.svg#close"></use>
					</svg>
				</button>
				<div class="popup__title">Оставить заявку</div>
				<div class="popup__form form">
					<?=do_shortcode('[contact-form-7 id="249" title="Модалка"]')?>
					<small>Нажимая кнопку Вы даёте согласие на обработку персональных данных.</small>
				</div>
			</div>
		</div>
	</div>

	<!-- Окно благодарности -->
	<div class="popup popup-thank" id="popup-thank">
		<div class="popup__dialog" role="document">
			<div class="popup__content">
				<button class="popup__close" data-popup-close>
					<svg class='close'>
						<use xlink:href="<?=get_template_directory_uri()?>/assets/img/sprite.svg#close"></use>
					</svg>
				</button>
				<div class="popup__title">Отправлено</div>
				<img src="<?=get_template_directory_uri()?>/assets/img/icons/check.svg" width="60" alt="">
			</div>
		</div>
	</div>
</div>

<?
	wp_footer();
?>
 
</body>

</html>


