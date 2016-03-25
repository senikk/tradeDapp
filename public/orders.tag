<orderitem>
  <div class="row">
    <div class="col s5">
      <addressview address={opts.order.address}></addressview>
    </div>
    <div class="col s5">
        { opts.order.product.title }<br>
        <p class="description">
          { opts.order.product.description }
        </p>
        <span class="lisk">{ opts.order.product.price } Ⱡ</span>   
    </div>
    <div class="col s2">
      <div class="row">
        <div class="chip status right">
          { statusText(opts.order.status) }
        </div>
      </div>
      <div class="row">
        <div if="opts.editable">
          <button if="opts.order.status == 1" onclick={changeStatus} class="waves-effect waves-light btn">Shipped it</button>
          <button if="opts.order.status == 1" onclick={payback} class="waves-effect waves-light btn {disabled: this.isModal}">Payback</buton>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div id="modal-payback-{opts.order.id}" class="modal bottom-sheet">
      <div class="modal-content">
          <h4>Confirm payback</h4>
          <p>I agree to pay back {opts.order.amount} Ⱡ for "{opts.order.product.title}" to buyer {opts.order.senderId}. This action can not be undone.</p>
      </div>
      <div class="modal-footer">
            <a onclick={agreepayback} class="modal-action modal-close waves-effect waves-light btn">Pay <i class="material-icons left">payment</i></a>
            <a class="modal-action modal-close waves-effect orange waves-light btn">Cancel</a>
      </div>
  </div>

  <script>
    this.mixin("Helper");

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

    agreepayback() {

    }

    payback() {
      this.modal('#modal-payback-'+opts.order.id);
     
      //this.changeStatus(id, 2); // TODO make a confirm box before sending money back
    }
  </script>
</orderitem>

<orders>
  <actions title="Orders"></actions>

  <ul class="collection with-header">
    <li class="collection-header"><h5>Your orders</h5></li>
    <li each={ yours } class="collection-item">
      <orderitem order={this}></orderitem>
    </li>
  </ul>

  <ul class="collection with-header">
    <li class="collection-header"><h5>Incomming orders</h5></li>
    <li each={ incomming } class="collection-item">
      <orderitem order={this}></orderitem>
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
            console.log(self.incomming);
            self.update();
          }
        });
    });
	</script>
</orders>