<orders>
  <actions title="Orders"></actions>

  <ul class="collection with-header">
    <li class="collection-header"><h5>Your orders</h5></li>
    <li each={ orders } class="collection-item row">
      <div class="col s8">
        <span class="title">
          { address.fullname }
        </span>
        <p class="address">
          { address.addressLine1 }<br>
          { address.addressLine2 }<br>
          { address.postalCode} { address.city }<br>
          { address.region }<br>
          { address.country }
        </p>
      </div>
      <div class="col s4">
          { product.title }<br>
          <div class="chip">
            { product.amount }
          </div>
      </div>
    </li>
    <li class="collection-header"><h5>Incomming orders</h5></li>
  </ul>

  <script>
 		var self = this;
 		var orders = [];
    this.mixin("Helper");

    this.on("before-mount", function () {
      this.api.get('/orders/list')
        .then(function (response) {
          console.log("RESPONSE OK GETTING ORDERS");
          console.log(response.data.success);
          if (response.data.success) {
            self.orders = response.data.response.orders;
            console.log(self.orders);
            self.update();
          }
        });
    });
	</script>
</orders>