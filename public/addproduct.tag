<addproduct>
    <actions title="Add your product"></actions>

	<ul class="collection with-header">
    	<li class="collection-item">
            <input name="title" placeholder="Title" />
            <input name="description" placeholder="Description" />
            <label>Price</label>
            <input name="price" placeholder="Ⱡ" />
            <label># items</label>
            <input name="stockQuantity" placeholder="Number of items for sale" />
        </li>
        <li class="collection-item">
            <button onclick={add} class="waves-effect waves-light btn "><i class="material-icons left">done</i>Add product</button>
      	</li>
 	</ul>

	<script>
 		var self = this;
        this.mixin("Helper");
        self.stockQuantity.value = 1;

        add(e) {
            this.api.post('/products/add', {
                title: self.title.value,
                description: self.description.value,
                price: parseInt(self.price.value),
                stockQuantity: parseInt(self.stockQuantity.value),
                secret: "senikk"
            }).then(function(response) {
                console.log("==OK==")
                console.log(response.data);

                self.title.value = "";
                self.description.value = "";
                self.price.value = "";
                self.stockQuantity.value = 1;
                riot.route("/");

            }).catch(function(response) {
                console.log("==Error==");
                console.log(response);
            });
        }
	</script>
</addproduct>