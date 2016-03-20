<products>
  <card title="lisk developer guide" description="A small book about how to develop Lisk dapps" price="1000"></card>
  <card title="A make a dapp for you" description="A simple dapp" price="5000"></card>
  <card title="Tenor Horn" description="Used tenor horn" price="30000"></card>
 	
  <script>
 		var self = this;
 		var products = [];
        this.mixin("Helper");

        this.on("mount", function () {
       /*     this.api.get('/products/list')
            .then(function (response) {
                console.log(response.data.response.products);
                self.messages = response.data.response.products;
                self.update();
            });*/
    });
	</script>
</products>