<orderslist>
  <ul class="collection with-header">
    <li class="collection-header"><h5>{opts.title}</h5></li>
    <li each={ opts.orders } class="collection-item">
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
            <span class="lisk">{ product.price } Ⱡ</span>   
        </div>
        <div class="col s2">
            <div class="chip status right">
              { statusText(status) }
            </div>
        </div>
      </div>
    </li>
  </ul>

  <script>
    var STATUS = [
      "CREATED",
      "SENT",
      "CANCELED"
    ];

    statusText(status) {
      return STATUS[status];
    }
  </script>
</orderslist>

<orders>
  <actions title="Orders"></actions>

  <orderslist title="Your orders" orders={yours}></orderslist>
  <orderslist title="Incomming orders" orders={incomming}></orderslist>

  <script>
 		var self = this;
 		var yours = [];
    var incomming = [];
    this.mixin("Helper");

    this.on("before-mount", function () {
      this.api.get('/orders/yours?secret=senikk2')
        .then(function (response) {
          if (response.data.success) {
            self.yours = response.data.response.orders;
            console.log(self.orders);
            self.update();
          }
        });

      this.api.get('/orders/incomming?secret=senikk2')
        .then(function (response) {
          if (response.data.success) {
            self.incomming = response.data.response.orders;
            console.log(self.orders);
            self.update();
          }
        });
    });
	</script>
</orders>