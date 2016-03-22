<card>
    <div class="product col s6">
      <div class="card small blue-grey darken-1">
        <div class="card-content white-text">
        	<h1 class="card-title">{opts.product.title}</h1>
  			  <p>{opts.product.description}</p>	
        </div>
        <div class="card-action">
			<button onclick={pay} class="waves-effect waves-light btn"><i class="material-icons left">payment</i> {opts.product.price} L</button>
        </div>
      </div>
    </div>

    <script>
        var self = this;
        this.mixin("Helper");

        pay(e) {
            console.log("PAYIT MAKE AN ORDER");
            this.api.post('/orders/add', {
                productId: opts.product.id,
                secret: "senikk",
                address: this.address
            }).then(function(response) {
                console.log("=O=OK==")
                console.log(response.data);
            }).catch(function(response) {
                console.log("=O=Error==");
                console.log(response);
            });
        }
    </script>
</card>