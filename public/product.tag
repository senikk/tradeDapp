<product>
    <div class="product col s6">
      <div class="card small blue-grey darken-1">
        <div class="card-content white-text">
            <div class="seller">{opts.product.sellerId}</div>
        	<h1 class="card-title">{opts.product.title}</h1>
  			<p>{opts.product.description}</p>
        </div>
        <div class="card-action">
    		<button onclick={buy} class="waves-effect waves-light btn"><i class="material-icons left">shopping_basket</i> {opts.product.price} Ⱡ</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div id="modal-payment-{opts.product.id}" class="modal bottom-sheet" onenter={enter}>
        <div class="modal-content">
            <h4>Confirm payment</h4>
            <p>I agree to pay {opts.product.price} Ⱡ for {opts.product.title} to seller {opts.product.sellerId}. This action can not be undone.</p>
        </div>
        <div class="modal-footer">
            <a onclick={pay} class="modal-action modal-close waves-effect waves-light btn">Pay <i class="material-icons right">payment</i></a>
            <a onclick={close} class="modal-action modal-close waves-effect orange waves-light btn">Cancel</a>
        </div>
    </div>

    <script>
        var self = this;
        this.mixin("Helper");

        enter() {
            console.log("enter");
        }

        pay() {
            console.log("AGREED TO PAY");
            console.log(opts.product.title);

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
            $('#modal-payment-'+opts.product.id).openModal({
                dismissible: true,
                opacity: .45,
                in_duration: 250,
                out_duration: 250,
                complete: function () { $('.lean-overlay').remove(); }
            });
        }
    </script>
</product>