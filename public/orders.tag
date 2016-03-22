<orders>
  <actions title="Orders"></actions>

  <ul class="collection with-header">
    <li class="collection-header"><h5>Your orders</h5></li>
    <li each={ orders } class="collection-item">
      <div class="row">
        <div class="col s5">
          <span class="title">
            { address.fullname }
          </span>
          <p>
            <div if={ address.addressLine1 } class="address">{ address.addressLine1 }</div>
            <div if={ address.addressLine2 } class="address">{ address.addressLine2 }</div>
            <div if={ address.city } class="address">{ address.postalCode} { address.city }</div>
            <div if={ address.region } class="address">{ address.region }</div>
            <div if={ address.country } class="address">{ address.country }</div>
          </p>
        </div>
        <div class="col s5">
            { product.title }<br>
            <p class="description">
              { product.description }
            </p>
            <span class="lisk">{ product.price } LISK</span>   
        </div>
        <div class="col s2">
            <div class="chip status right">
              { statusText(status) }
            </div>
        </div>
      </div>
    </li>

    <li class="collection-header"><h5>Incomming orders</h5></li>
  </ul>

  <script>
 		var self = this;
 		var orders = [];
    this.mixin("Helper");

    var STATUS = [
      "CREATED",
      "SENT",
      "CANCELED"
    ];

    statusText(status) {
      return STATUS[status];
    }

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