<app>
	<store if={ tag == 'store'}></store>
	<product if={ tag == 'product'}></product>
	<orders if={ tag == 'orders'}></orders>

	<script>
		var self = this;
		this.mixin('Helper');
	
		riot.route(function(action) {
			self.update({tag: action || 'store'});
		});
	</script>
</app>