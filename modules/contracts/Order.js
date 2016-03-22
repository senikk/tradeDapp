var private = {}, self = null,
	library = null, modules = null;

var STATUS = {
	CREATED: 0,
	SENT: 1,
	CANCELED: 2
}

function Order(cb, _library) {
	self = this;
	self.type = 2
	library = _library;
	cb(null, self);
}

Order.prototype.create = function (data, trs) {
    trs.asset = {
        status: STATUS.CREATED,
        fullname: data.fullname,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country
    };

    return trs;
}

Order.prototype.calculateFee = function (trs) {
	return 0;
}

Order.prototype.verify = function (trs, sender, cb, scope) {
	setImmediate(cb, null, trs);
}

Order.prototype.getBytes = function (trs) {
    console.log("=O=getBytes");
    console.log(trs);
    var b = Buffer.concat([
        new Buffer(trs.asset.fullname, 'hex'),
        new Buffer(trs.asset.addressLine1, 'hex'),
        new Buffer(trs.asset.addressLine2, 'hex')
    ]);

    return b;
}

Order.prototype.apply = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

Order.prototype.undo = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

Order.prototype.applyUnconfirmed = function (trs, sender, cb, scope) {
    console.log("=O= APPLY UNCONFIRMED ==");
    console.log(trs);

    if (sender.u_balance < trs.fee) {
        return setImmediate(cb, "Sender doesn't have enough coins");
    }

    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

Order.prototype.undoUnconfirmed = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

Order.prototype.ready = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

Order.prototype.save = function (trs, cb) {
    console.log("=O= SAVE ==");
    console.log(trs);
    modules.api.sql.insert({
        table: "asset_orders",
        values: {
            transactionId: trs.id,
            productId: trs.productId,
            status: STATUS.CREATED,
        	fullname: trs.fullname,
        	addressLine1: trs.addressLine1,
        	addressLine2: trs.addressLine2,
        	city: trs.city,
        	region: trs.region,
        	postalCode: trs.postalCode,
        	country: trs.country
        }
    }, cb);
}

Order.prototype.dbRead = function (row) {
    if (!row.p_transactionId) {
        return null;
    } else {
        return {
            fullname: row.p_fullname,
            addressLine1: row.p_addressLine1,
            addressLine2: row.p_addressLine2
        };
    }
}

Order.prototype.normalize = function (asset, cb) {
    library.validator.validate(asset, {
        type: "object",
        properties: {
            fullname: {
                type: "string",
                minLength: 1,
            },
            addressLine1: {
                type: "string",
                minLength: 1
            }
        },
        required: ["fullname","addressLine1"]
    }, cb);
}

Order.prototype.onBind = function (_modules) {
	modules = _modules;
	modules.logic.transaction.attachAssetType(self.type, self);
}

Order.prototype.add = function (cb, query) {
    console.log("=O=ADD==");
    console.log(query);

    // Validate query object
    library.validator.validate(query, {
        type: "object",
        properties: {
            secret: {
                type: "string",
                minLength: 1,
                maxLength: 100
            },
            productId: {
            	type: "string",
            	minLength: 1,
            	maxLength: 21
            },
            address: {
            	type: "object",
            	properties: {
		            fullname: {
		                type: "string",
		                minLength: 1,
		                maxLength: 100
		            },
		            addressLine1: {
		                type: "string",
		                minLength: 1,
		                maxLength: 100
		            },
		            addressLine2: {
		                type: "string",
		                minLength: 0,
		                maxLength: 100
		            },
		            city: {
		                type: "string",
		                minLength: 0,
		                maxLength: 50
		            },            
		            region: {
		                type: "string",
		                minLength: 0,
		                maxLength: 20
		            },            
		            postalCode: {
		                type: "string",
		                minLength: 0,
		                maxLength: 20
		            },            
		            country: {
		                type: "string",
		                minLength: 0,
		                maxLength: 20
		            },
            	},
            	required: ["fullname", "addressLine1"]
            },
        },
        required: ["secret", "productId", "address"]
    }, function (err) {
        // If error exists, execute callback with error as first argument
        if (err) {
            console.log("=O= ERR1 ==");
            console.log(err);
            return cb(err[0].message);
        }

        var keypair = modules.api.crypto.keypair(query.secret);
        modules.blockchain.accounts.setAccountAndGet({
            publicKey: keypair.publicKey.toString('hex')
        }, function (err, account) {
            // If error occurs, call cb with error argument
            if (err) {
                console.log("=O= ERR2 ==");
                console.log(err);
                return cb(err);
            }

            try {
                var transaction = library.modules.logic.transaction.create({
                    type: self.type,
                    productId: query.productId,
                    fullname: query.address.fullname,
                    addressLine1: query.address.addressLine1,
                    addressLine2: query.address.addressLine2,
                    city: query.address.city,
                    region: query.address.region,
                    country: query.address.country,
                    sender: account,
                    keypair: keypair
                });
            } catch (e) {
                // Catch error if something goes wrong
                console.log("=O= ERR3 ==");
                console.log(e);
                return setImmediate(cb, e.toString());
            }

            // Send transaction for processing
            modules.blockchain.transactions.processUnconfirmedTransaction(transaction, cb);
        });
    });
}

Order.prototype.list = function (cb, query) {
        // Select from transactions table and join Products from the asset_Products table
        console.log("==LIST CALLED==");

        modules.api.sql.select({
            table: "transactions",
            alias: "t",
            condition: {
                type: self.type
            },
            join: [{
                type: 'left outer',
                table: 'asset_orders',
                alias: "o",
                on: {"t.id": "o.transactionId"}
            }],
            sort: {
                timestamp: -1,
                status: -1
            }
        }, ['id', 'type', 'senderId', 'senderPublicKey', 'recipientId', 'amount', 'fee', 'timestamp', 'signature', 'blockId', 'token', 'transactionId', 'productId', 'status', 'fullname', 'addressLine1', 'addressLine2', 'city', 'region', 'postalCode', 'country'], function (err, transactions) {
            if (err) {
                return cb(err.toString());
            }

            // Map results to asset object
            var orders = transactions.map(function (tx) {
                var order = {
                    id: tx.transactionId,
                    status: tx.status,
                    address: {
	                    fullname: tx.fullname,
	                    addressLine1: tx.addressLine1,
	                    addressLine2: tx.addressLine2,
	                    city: tx.city,
	                    region: tx.region,
	                    postalCode: tx.postalCode,
	                    country: tx.country                    	
                    },
                    product: {

                    }
                };

                return order;
            });

            return cb(null, {
                orders: orders
            })
        });
}

module.exports = Order;