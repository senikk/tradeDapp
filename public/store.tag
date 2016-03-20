<store>
    <actions title="tradeDapp"></actions>

    <section class="row">
        <section class="col s8">
            <products></products>
        </section>
        <section class="col s4">
            <address></address>
        </section>
    </section>

	<script>
 		var self = this;
        this.mixin("Helper");

        send(e) {
            this.api.put('/messages/add', {
                recipientId: "12994786767195560727L",
                message: self.message.value,
                secret: "senikk" 
            });
        }
	</script>
</store>