<orderitem>
  <div class="row">
    <div class="col s5">
      <span class="title">
        { opts.order.address.fullname }
      </span>
      <p>
        <div if={ address.addressLine1 } class="address">{ opts.order.address.addressLine1 }</div>
        <div if={ address.addressLine2 } class="address">{ opts.order.address.addressLine2 }</div>
        <div if={ address.city } class="address">{ opts.order.address.postalCode} { opts.order.address.city }</div>
        <div if={ address.region } class="address">{ opts.order.address.region }</div>
        <div if={ address.country } class="address">{ opts.order.address.country }</div>
      </p>
    </div>
    <div class="col s5">
        { opts.order.product.title }<br>
        <p class="description">
          { opts.order.product.description }
        </p>
        <span class="lisk">{ opts.order.product.price } Ⱡ</span>   
    </div>
    <div class="col s2">
        <div class="chip status right">
          { statusText(opts.order.status) }
        </div>
        <div if="opts.editable">
          <button onclick={changeStatus(id,1)}>Sent</button>
          <button onclick={payback(id)}>Payback</buton>
        </div>
    </div>
  </div>

  <!-- Modal -->
  <div id="modal-payback-{opts.order.id}" class="modal bottom-sheet">
      <div class="modal-content">
          <h4>Confirm payment</h4>
          <p>I agree to pay {opts.product.price} Ⱡ for {opts.product.title} to seller {opts.product.sellerId}. This action can not be undone.</p>
      </div>
      <div class="modal-footer">
          <a href="#!" onclick={pay} class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
          <a href="#!" onclick={cancel} class="modal-action modal-close waves-effect waves-orange btn-flat">Cancel</a>
      </div>
  </div>

  <script>
    var STATUS = [
      "CREATED",
      "SENT",
      "PAIDBACK"
    ];

    statusText(status) {
      return STATUS[status];
    }

    changeStatus(id, status) {
      this.api.put('/orders/status', {
        status: status,
        secret: this.login.secret
      }).then(function (response) {
          if (response.data.success) {
            self.update();
          }
        });
    }

    payback(id) {
      $('#modal-payback-'+opts.order.id).openModal();
     
      this.changeStatus(id, 2); // TODO make a confirm box before sending money back
    }
  </script>
</orderitem>

<orders>
  <actions title="Orders"></actions>

  <ul class="collection with-header">
    <li class="collection-header"><h5>Your orders</h5></li>
    <li each={ opts.orders } class="collection-item">
      <orderitem order={order}></orderitem>
    </li>
  </ul>

  <ul class="collection with-header">
    <li class="collection-header"><h5>Incomming orders</h5></li>
    <li each={ orders } class="collection-item">
      <orderitem order={order}></orderitem>
    </li>
  </ul>

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