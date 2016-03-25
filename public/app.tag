<app>
	<store if={ tag == 'store'}></store>
	<addproduct if={ tag == 'product'}></addproduct>
	<orders if={ tag == 'orders'}></orders>

	<script>
		var self = this;
		this.mixin('Helper');
	
		riot.route(function(action) {
			self.update({tag: action || 'store'});
		});
	</script>
</app>