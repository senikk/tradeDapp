<products>
  <card each={p in products} product={p}></card>

  <script>
 		var self = this;
 		var products = [];
    this.mixin("Helper");

    this.on("before-mount", function () {
      this.api.get('/products/list')
        .then(function (response) {
          console.log(response.data.response.products);
          self.products = response.data.response.products;
          self.update();
        });
    });
	</script>
</products>