<actions>
	 <div class="row">
      	<div class="col s4">
	    	<h5 onclick={home}><i class="material-icons left">store</i> { opts.title}</h5>
      	</div>
      	<div class="col s8 right-align" style="padding-top: 10px;">
			<a class="btn-floating btn-medium" href="#/orders">
		  		<i class="medium material-icons">list</i>
			</a>
			<a class="btn-floating btn-medium" href="#/product">
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
    </script>
</actions>