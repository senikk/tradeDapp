var private = {}, self = null,
    library = null, modules = null;

function Product(cb, _library) {
    self = this;
    self.type = 1
    library = _library;
    cb(null, self);
}

Product.prototype.create = function (data, trs) {
    trs.recipientId = data.recipientId;
    trs.asset = {
        title: data.title,
        description: data.description,
        price: data.price,
        stockQuantity: data.stockQuantity
    };

    return trs;
}

Product.prototype.calculateFee = function (trs) {
    return 100000000;
}

Product.prototype.verify = function (trs, sender, cb, scope) {
    if (trs.asset.title.length > 100) {
        return setImmediate(cb, "Max length of product title is 100 chars");
    }

    setImmediate(cb, null, trs);
}

Product.prototype.getBytes = function (trs) {
    return new Buffer(trs.asset.title + trs.asset.title, 'hex');
}

Product.prototype.apply = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

Product.prototype.undo = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

Product.prototype.applyUnconfirmed = function (trs, sender, cb, scope) {
    if (sender.u_balance < trs.fee) {
        return setImmediate(cb, "Sender doesn't have enough coins");
    }

    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

Product.prototype.undoUnconfirmed = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

Product.prototype.ready = function (trs, sender, cb, scope) {
    setImmediate(cb);
}

Product.prototype.save = function (trs, cb) {
    modules.api.sql.insert({
        table: "asset_products",
        values: {
            transactionId: trs.id,
            title: trs.asset.title,
            description: trs.asset.description,
            price: trs.asset.price,
            stockQuantity: trs.asset.stockQuantity
        }
    }, cb);
}

Product.prototype.dbRead = function (row) {
    if (!row.p_transactionId) {
        return null;
    } else {
        return {
            Product: row.p_products
        };
    }
}

Product.prototype.normalize = function (asset, cb) {
    library.validator.validate(asset, {
        type: "object",
        properties: {
            title: {
                type: "string",
                minLength: 1,
                maxLength: 100
            }
        },
        required: ["title"]
    }, cb);
}

Product.prototype.onBind = function (_modules) {
    modules = _modules;
    modules.logic.transaction.attachAssetType(self.type, self);
}

Product.prototype.add = function (cb, query) {
    console.log("==ADD==");
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
            title: {
                type: "string",
                minLength: 1,
                maxLength: 100
            },
            price: {
                type: "integer",
                not_null: true
            },
            stockQuantity: {
                type: "number",
                not_null: true
            }
        },
        required: ["secret", "title", "price", "stockQuantity"]
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

            try {
                var transaction = library.modules.logic.transaction.create({
                    type: self.type,
                    title: query.title,
                    description: query.description,
                    price: query.price,
                    stockQuantity: query.stockQuantity,
                    recipientId: account.address,
                    sender: account,
                    keypair: keypair
                });
            } catch (e) {
                // Catch error if something goes wrong
                return setImmediate(cb, e.toString());
            }

            console.log("==PROCESS IT")
            console.log(transaction);

            // Send transaction for processing
            modules.blockchain.transactions.processUnconfirmedTransaction(transaction, cb);
        });
    });
}

Product.prototype.list = function (cb, query) {
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
                table: 'asset_products',
                alias: "p",
                on: {"t.id": "p.transactionId"}
            }],
            sort: {
                timestamp: -1
            }
        }, ['id', 'type', 'senderId', 'senderPublicKey', 'recipientId', 'amount', 'fee', 'timestamp', 'signature', 'blockId', 'token', 'transactionId', 'title', 'description', 'price', 'stockQuantity'], function (err, transactions) {
            if (err) {
                return cb(err.toString());
            }

            console.log("===");
            console.log(transactions);

            // Map results to asset object
            var products = transactions.map(function (tx) {
                var product = {
                    id: tx.transactionId,
                    title: tx.title,
                    description: tx.description,
                    price: tx.price,
                    stockQuantity: tx.stockQuantity
                };

                return product;
            });

            return cb(null, {
                products: products
            })
        });
}

module.exports = Product;