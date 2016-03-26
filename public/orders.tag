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
      <div if={opts.editable} class="row buttongroup">
          <button if={opts.order.status == 0} onclick={shipit} class="col s12 waves-effect waves-light btn">Shipped it</button>
          <button if={opts.order.status == 0} onclick={payback} class="col s12 waves-effect waves-light btn {disabled: this.isModal}">Payback</buton>
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
    var self = this;
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
      console.log("CHANGE STATUS TO " + status + " for " + id);

      this.api.put('/orders/status', {
        orderId: id,
        status: status,
        secret: this.login.secret
      }).then(function (response) {
          if (response.data.success) {
            console.log("ORDER CHANGED STATUS");
            console.log(response.data);
            opts.order.status = status;
            self.update();
          }
        });
    }

    shipit() {
      this.changeStatus(opts.order.id, 1);
    }

    agreepayback() {
      this.changeStatus(opts.order.id, 2); // TODO make a confirm box before sending money back
    }

    payback() {
      this.modal('#modal-payback-'+opts.order.id);     
    }
  </script>
</orderitem>

<orders>
  <actions title="Orders"></actions>

  <ul if={incomming.length > 0} class="collection with-header">
    <li class="collection-header"><h5>Incomming orders</h5></li>
    <li each={ incomming } class="collection-item">
      <orderitem order={this} editable={true}></orderitem>
    </li>
  </ul>

  <ul if={yours.length > 0} class="collection with-header">
    <li class="collection-header"><h5>Your orders</h5></li>
    <li each={ yours } class="collection-item">
      <orderitem order={this} editable={false}></orderitem>
    </li>
  </ul>

  <ul if={yours.length == 0 && incomming.length == 0} class="collection with-header">
    <li class="collection-header">No orders</li>
  </ul>

  <script>
 		var self = this;
 		var yours = [];
    var incomming = [];
    this.mixin("Helper");

    this.on("before-mount", function () {
      this.fetch();
    });

    this.event.on("login:after", function () {
      self.fetch();
    });

    fetch() {
      this.api.get('/orders/yours?secret=' + this.login.secret)
        .then(function (response) {
          if (response.data.success) {
            self.yours = response.data.response.orders;
            console.log(self.orders);
            self.update();
          }
        });

      this.api.get('/orders/incomming?secret=' + this.login.secret)
        .then(function (response) {
          if (response.data.success) {
            self.incomming = response.data.response.orders;
            console.log(self.incomming);
            self.update();
          }
        });      
    }
	</script>
</orders>