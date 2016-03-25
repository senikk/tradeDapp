<actions>
  <div class="row">
    <div class="col s1">
      <h5 onclick={home}><i class="material-icons left medium">store</i></h5>
    </div>
    <div class="col s8 right-align" style="padding-top: 10px;">
      <input type="text" name="yoursecret" class="s4" placeholder="Enter your secret" onchange={setsecret} />
    </div>
    <div class="col s3 right-align" style="padding-top: 10px;">
      <a class="btn-floating btn-large" onclick={search}>
        <i class="medium material-icons">search</i>
      </a>
		  <a class="btn-floating btn-large" href="#/orders">
		    <i class="medium material-icons">list</i>
			</a>
			<a class="btn-floating btn-large" href="#/product">
		  		<i class="medium material-icons">library_add</i>
			</a>
    </div>
  </div>

  <script>
    var self = this;
    this.mixin("Helper");

    home() {
      riot.route("/");
    }

    search() {
      console.log("searching");
    }

    setsecret() {
      this.login.secret = this.yoursecret.value;
    }
  </script>
</actions>