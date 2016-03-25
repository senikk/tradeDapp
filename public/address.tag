<address>
	<ul class="collection with-header">
        <li class="collection-header">
            <i class="material-icons left">perm_identity</i> Delivery address (<span class="required">* required</span>)
        </li>
    	<li class="collection-item">
            <input name="fullname" placeholder="Full name" onchange={fullnameChange}/>
            <input name="addressLine1" placeholder="Address Line 1" onchange={addressLine1Change}/>
            <input name="addressLine2" placeholder="Addres Line 2" onchange={addressLine2Change}/>
            <input name="postalCode" placeholder="ZIP/Postal Code" class="col s6" onchange={postalCodeChange}/>
            <input name="city" placeholder="City" class="col s6" onchange={cityChange}/>
            <input name="region" placeholder="State/Province/Region" onchange={regionChange}/>
            <input name="country" placeholder="Country" onchange={countryChange}/>
        </li>        
 	</ul>

    <script>
        var self = this;
        this.mixin("Helper");

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

<addressview>
  <section>
      <span class="title">{ opts.address.fullname }</span>
      <p>
        <div if="opts.address.addressLine1" class="address">{ opts.address.addressLine1 }</div>
        <div if="opts.address.addressLine2" class="address">{ opts.address.addressLine2 }</div>
        <div if="opts.address.city" class="address">{ opts.address.postalCode} { opts.address.city }</div>
        <div if="opts.address.region" class="address">{ opts.address.region }</div>
        <div if="opts.address.country" class="address">{ opts.address.country }</div>
      </p>
  </section>
</addressview>

<addressviewinline>
      <span class="title">{ opts.address.fullname }</span>
        <span if="opts.address.addressLine1">{ opts.address.addressLine1 },</span>
        <span if="opts.address.addressLine2">{ opts.address.addressLine2 },</span>
        <span if="opts.address.city">{ opts.address.postalCode} { opts.address.city },</span>
        <span if="opts.address.region">{ opts.address.region },</span>
        <span if="opts.address.country">{ opts.address.country }</span>
</addressviewinline>