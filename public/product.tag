<product>
    <actions title="Add your product"></actions>

	<ul class="collection with-header">
    	<li class="collection-item">
            <label>Title</label>
            <input name="title" />
        </li>
    	<li class="collection-item">
            <label>Description</label>
            <input name="description" />
        </li>        
    	<li class="collection-item">
            <label>Price in Lisk</label>
            <input name="price" />
        </li>        
        <li class="collection-item">
            <button onclick={add} class="waves-effect waves-light btn "><i class="material-icons left">done</i>Add product</button>
      	</li>
 	</ul>

	<script>
 		var self = this;
        this.mixin("Helper");

        add(e) {
            this.api.post('/products/add', {
                title: self.title.value,
                description: self.description.value,
                price: parseInt(self.price.value),
                stockQuantity: 0,
                secret: "senikk"
            }).then(function(response) {
                console.log("==OK==")
                console.log(response.data);
            }).catch(function(response) {
                console.log("==Error==");
                console.log(response);
            });
        }
	</script>
</product>