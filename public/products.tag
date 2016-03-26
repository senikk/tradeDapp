<products>  
  <product each={p in products} product={p}></product>
          
  <script>
 		var self = this;
 		var products = [];
    this.mixin("Helper");

    this.on("before-mount", function () {
      this.api.get('/products/list')
        .then(function (response) {
          console.log("RESPONSE OK");
          console.log(response.data.success);
          if (response.data.success) {
            self.products = response.data.response.products;
            console.log(self.products);
            self.update();
          }
        });
    });
	</script>
</products>