<address>
	<ul class="collection with-header">
        <li class="collection-header">
            <i class="material-icons left">perm_identity</i> Delivery address (<span class="required">* required</span>)
        </li>
    	<li class="collection-item">
            <input name="fullname" placeholder="Full name" onchange={fullnameChange} />
            <input name="addressLine1" placeholder="Address Line 1" onchange={addressLine1Change}/>
            <input name="addressLine2" placeholder="Addres Line 2" onchange={addressLine2Change}/>
            <input class="col s6" name="postalCode" placeholder="ZIP/Postal Code" onchange={postalCodeChange}/>
            <input class="col s6" name="city" placeholder="City" onchange={cityChange}/>
            <input name="region" placeholder="State/Province/Region" onchange={regionChange}/>
            <input name="country" placeholder="Country" onchange={countryChange}/>
        </li>        
 	</ul>

    <script>
        var self = this;
        this.mixin("Helper");

        this.fullname.value = this.address.fullname;

        fullnameChange() {
            this.address.fullname = this.fullname.value;
        }

        addressLine1Change() {
            this.address.addressLine1 = this.addressLine1.value;
        }

        addressLine2Change() {
            this.address.addressLine2 = this.addressLine2.value;
        }

        postalCodeChange() {
            this.address.postalCode = this.postalCode.value;
        }

        regionChange() {
            this.address.region = this.region.value;
        }

        countryChange() {
            this.address.country = this.country.value;
        }

    </script>
</address>