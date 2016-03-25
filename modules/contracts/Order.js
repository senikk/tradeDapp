var async = require('async');

var private = {}, self = null,
	library = null, modules = null;

var STATUS = {
	CREATED: 0,
	SENT: 1,
	PAIDPACK: 2
}

function Order(cb, _library) {
	self = this;
	self.type = 2
	library = _library;
	cb(null, self);
}

Order.prototype.create = function (data, trs) {
    console.log("== CREATE ==");
    console.log(data);
    trs.recipientId = data.recipientId;
    trs.amount = data.amount;
    trs.asset = {
        productId: data.productId,
        status: STATUS.CREATED,
        fullname: data.fullname,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || "",
        city: data.city || "",
        region: data.region || "",
        postalCode: data.postalCode || "",
        country: data.country || ""
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
    var b = Buffer.concat([
        new Buffer(trs.asset.fullname, 'utf8'),
        new Buffer(trs.asset.addressLine1, 'utf8')
    ]);

    return b;
}

Order.prototype.apply = function (trs, sender, cb, scope) {
    var amount = trs.amount; // product.price..

    if (sender.balance < amount) {
        return setImmediate(cb, "Balance has no enough Lisk: " + trs.id);
    }

    async.series([
        function (cb) {
            modules.blockchain.accounts.mergeAccountAndGet({
                address: sender.address,
                balance: -amount
            }, cb, scope);
        },
        function (cb) {
            modules.blockchain.accounts.mergeAccountAndGet({
                address: trs.recipientId,
                balance: trs.amount
            }, cb, scope);
        }
    ], cb);
}

Order.prototype.undo = function (trs, sender, cb, scope) {
    var amount = trs.amount; // product.price

    async.series([
        function (cb) {
            modules.blockchain.accounts.undoMerging({
                address: sender.address,
                balance: -amount
            }, cb, scope);
        },
        function (cb) {
            modules.blockchain.accounts.undoMerging({
                address: trs.recipientId,
                balance: trs.amount
            }, cb, scope);
        }
    ], cb);
}

Order.prototype.applyUnconfirmed = function (trs, sender, cb, scope) {
    var amount = trs.amount; //

    console.log("=O= applyUnconfirmed");
    console.log(sender);

    if (sender.u_balance < amount) {
        return setImmediate(cb, "Sender doesn't have enough coins");
    }

    async.series([
        function (cb) {
            modules.blockchain.accounts.mergeAccountAndGet({
                address: sender.address,
                u_balance: -amount
            }, cb, scope);
        },
        function (cb) {
            modules.blockchain.accounts.mergeAccountAndGet({
                address: trs.recipientId,
                u_balance: trs.amount
            }, cb, scope);
        }
    ], cb);
}

Order.prototype.undoUnconfirmed = function (trs, sender, cb, scope) {
    var amount = trs.amount;

    async.series([
        function (cb) {
            modules.blockchain.accounts.undoMerging({
                address: sender.address,
                u_balance: -amount
            }, cb, scope);
        },
        function (cb) {
            modules.blockchain.accounts.undoMerging({
                address: trs.recipientId,
                u_balance: trs.amount
            }, cb, scope);
        }
    ], cb);
}

Order.prototype.ready = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

Order.prototype.save = function (trs, cb) {
    modules.api.sql.insert({
        table: "asset_orders",
        values: {
            transactionId: trs.id,
            productId: trs.asset.productId,
            status: STATUS.CREATED,
        	fullname: trs.asset.fullname,
        	addressLine1: trs.asset.addressLine1,
        	addressLine2: trs.asset.addressLine2,
        	city: trs.asset.city,
        	region: trs.asset.region,
        	postalCode: trs.asset.postalCode,
        	country: trs.asset.country
        }
    }, cb);
}

Order.prototype.dbRead = function (row) {
    if (!row.o_transactionId) {
        return null;
    } else {
        return {
            fullname: row.o_fullname,
            addressLine1: row.o_addressLine1,
            addressLine2: row.o_addressLine2,
            city: row.o_city,
            region: row.o_region,
            postalCode: row.o_postalCode,
            country: row.o_country
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
            return cb(err[0].message);
        }

        var keypair = modules.api.crypto.keypair(query.secret);
        modules.blockchain.accounts.setAccountAndGet({
            publicKey: keypair.publicKey.toString('hex')
        }, function (err, account) {
            // If error occurs, call cb with error argument
            if (err) {
                return cb(err);
            }

            // Find the seller
            modules.api.sql.select({
                table: "transactions",
                alias: "t",
                condition: {
                    id: query.productId,
                    type: 1
                },
                join: [{
                    type: 'left outer',
                    table: 'asset_products',
                    alias: "p",
                    on: {"t.id": "p.transactionId"}
                }],
                fields: ['senderPublicKey', 'price']
            }, {senderPublicKey: String, price: Number}, function (err, rows) {
                if (err || rows.length == 0) {
                    return cb(err? err.toString() : "Can't find product");
                }

                console.log("== ROW ==");
                console.log(rows[0]);

                modules.blockchain.accounts.getAccount({
                    publicKey: rows[0].senderPublicKey
                }, function (err, recipient) {
                    if (err || !recipient) {
                        return cb(err? err.toString() : "Can't find recipient");
                    }

                    try {
                        var transaction = library.modules.logic.transaction.create({
                            type: self.type,
                            amount: rows[0].price,
                            productId: query.productId,
                            fullname: query.address.fullname,
                            addressLine1: query.address.addressLine1,
                            addressLine2: query.address.addressLine2 || "",
                            city: query.address.city || "",
                            region: query.address.region || "",
                            country: query.address.country || "",
                            recipientId: recipient.address,
                            sender: account,
                            keypair: keypair
                        });
                    } catch (e) {
                        // Catch error if something goes wrong
                        return setImmediate(cb, e.toString());
                    }

                    modules.blockchain.transactions.processUnconfirmedTransaction(transaction, cb);
                });
            });
        });
    });
}

Order.prototype.yours = function (cb, query) {
        console.log("=O=YOURS CALLED==");
    
        var keypair = modules.api.crypto.keypair(query.secret);
        modules.blockchain.accounts.setAccountAndGet({
            publicKey: keypair.publicKey.toString('hex')
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            modules.api.sql.select({
                table: "transactions",
                alias: "t",
                condition: {
                    type: self.type,
                    senderId: account.address
                },
                join: [{
                    type: 'left outer',
                    table: 'asset_orders',
                    alias: "o",
                    on: {"t.id": "o.transactionId"}
                },{
                    type: 'left outer',
                    table: 'asset_products',
                    alias: "p",
                    on: {"o.productId": "p.transactionId"}                
                }],
                sort: {
                    timestamp: -1,
                    status: -1
                }
            }, ['id', 'type', 'senderId', 'senderPublicKey', 'recipientId', 'amount', 'fee', 'timestamp', 'signature', 'blockId', 'token', 
                'transactionId', 'productId', 'status', 'fullname', 'addressLine1', 'addressLine2', 'city', 'region', 'postalCode', 'country', 
                'transactionIdP', 'title', 'description', 'price', 'stockQuantity'], 
                    function (err, transactions) {
                if (err) {
                    return cb(err.toString());
                }
          
                // Map results to asset object
                var orders = transactions.map(function (tx) {
                    var order = {
                        id: tx.transactionId,
                        status: tx.status,
                        amount: tx.amount,
                        recipientId: tx.recipientId,
                        senderId: tx.senderId,
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
                            title: tx.title,
                            description: tx.description,
                            price: tx.amount
                        }
                    };

                    console.log(order);

                    return order;
                });

                return cb(null, {
                    orders: orders
                })
            });
        });
}

Order.prototype.incomming = function (cb, query) {
        console.log("=O=INCOMMING CALLED==");

        var keypair = modules.api.crypto.keypair(query.secret);
        modules.blockchain.accounts.setAccountAndGet({
            publicKey: keypair.publicKey.toString('hex')
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            modules.api.sql.select({
                table: "transactions",
                alias: "t",
                condition: {
                    type: self.type,
                    recipientId: account.address
                },
                join: [{
                    type: 'left outer',
                    table: 'asset_orders',
                    alias: "o",
                    on: {"t.id": "o.transactionId"}
                },{
                    type: 'left outer',
                    table: 'asset_products',
                    alias: "p",
                    on: {"o.productId": "p.transactionId"}                
                }],
                sort: {
                    timestamp: -1,
                    status: -1
                }
            }, ['id', 'type', 'senderId', 'senderPublicKey', 'recipientId', 'amount', 'fee', 'timestamp', 'signature', 'blockId', 'token', 
                'transactionId', 'productId', 'status', 'fullname', 'addressLine1', 'addressLine2', 'city', 'region', 'postalCode', 'country', 
                'transactionIdP', 'title', 'description', 'price', 'stockQuantity'], 
                    function (err, transactions) {
                if (err) {
                    return cb(err.toString());
                }
          
                // Map results to asset object
                var orders = transactions.map(function (tx) {
                    var order = {
                        id: tx.transactionId,
                        status: tx.status,
                        amount: tx.amount,
                        recipientId: tx.recipientId,
                        senderId: tx.senderId,
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
                            title: tx.title,
                            description: tx.description,
                            price: tx.amount
                        }
                    };

                    console.log(order);

                    return order;
                });

                return cb(null, {
                    orders: orders
                })
            });
        });
}

Order.prototype.address = function (cb, query) {
        console.log("=O=LAST ADDRESS CALLED==");

        var keypair = modules.api.crypto.keypair(query.secret);
        modules.blockchain.accounts.setAccountAndGet({
            publicKey: keypair.publicKey.toString('hex')
        }, function (err, account) {
            // If error occurs, call cb with error argument
            if (err) {
                return cb(err);
            }

            modules.api.sql.select({
                table: "transactions",
                alias: "t",
                condition: {
                    type: self.type,
                    senderId: account.address
                },
                join: [{
                    type: 'left outer',
                    table: 'asset_orders',
                    alias: "o",
                    on: {"t.id": "o.transactionId"}
                }],
                sort: {
                    timestamp: -1
                },
                limit: 1
            }, ['id', 'type', 'senderId', 'senderPublicKey', 'recipientId', 'amount', 'fee', 'timestamp', 'signature', 'blockId', 'token', 
                'transactionId', 'productId', 'status', 'fullname', 'addressLine1', 'addressLine2', 'city', 'region', 'postalCode', 'country'], 
                    function (err, transactions) {
                        if (err) {
                            return cb(err.toString());
                        }
          
                        console.log("== RESULT ==");
                        console.log(transactions);

                        var tx = transactions[0];

                        return cb(null, {
                            address: {
                                fullname: tx.fullname,
                                addressLine1: tx.addressLine1,
                                addressLine2: tx.addressLine2,
                                city: tx.city,
                                region: tx.region,
                                postalCode: tx.postalCode,
                                country: tx.country
                            }
                        });
                    });
            });
}

module.exports = Order;