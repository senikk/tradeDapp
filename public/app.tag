<app>
	<store if={ tag == 'store'}></store>
	<product if={ tag == 'product'}></product>

	<script>
		var self = this;
		this.mixin('Helper');
	
		riot.route(function(action) {
			self.update({tag: action || 'store'});
		});
	</script>
</app>