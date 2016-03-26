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

		this.event.on("login:after", function () {
	        if (self.login.secret && Object.keys(self.address).length == 0) {
                self.api.get('/orders/address?secret=' + self.login.secret)
                    .then(function (response) {
                      self.setAddress(response.data.response.address);
                    });                
            }
        });

	</script>
</app>