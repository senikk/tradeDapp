<product>
    <div class="product col s6">
      <div class="card small blue-grey darken-1">
        <div class="card-content white-text">
            <div class="seller">{opts.product.sellerId}</div>
        	<h1 class="card-title">{opts.product.title}</h1>
  			<p>{opts.product.description}</p>
        </div>
        <div class="card-action">
        	<button onclick={buy} class="waves-effect waves-light btn {disabled: this.isModal}"><i class="material-icons left">shopping_basket</i> {opts.product.price} Ⱡ</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div id="modal-payment-{opts.product.id}" class="modal bottom-sheet">
        <div class="modal-content">
            <h4>Confirm payment</h4>
            <p>I agree to pay {opts.product.price} Ⱡ for "{opts.product.title}" to seller {opts.product.sellerId} delivered to specified address. This action can not be undone.</p>
            <addressviewinline address={this.address}></addressviewline>
        </div>
        <div class="modal-footer">
            <a onclick={agreepay} class="modal-action modal-close waves-effect waves-light btn">Pay <i class="material-icons left">payment</i></a>
            <a class="modal-action modal-close waves-effect orange waves-light btn">Cancel</a>
        </div>
    </div>

    <script>
        var self = this;
        this.mixin("Helper");

        agreepay() {
            console.log("AGREED TO PAY");
            console.log(opts.product.title);
            console.log(this.address);

           /*
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
            */
        }

        buy() {
            this.modal('#modal-payment-'+opts.product.id);
        }
    </script>
</product>