var private = {}, self = null,
	library = null, modules = null;

function OrderUpdate(cb, _library) {
	self = this;
	self.type = 3
	library = _library;
	cb(null, self);
}

OrderUpdate.prototype.create = function (data, trs) {
	console.log("<3OU CREATE = " + JSON.stringify(data));

	trs.recipientId = data.recipientId;
	trs.asset = {
        orderId: data.orderId,
        status: data.status
    };

	return trs;
}

OrderUpdate.prototype.calculateFee = function (trs) {
	return 0;
}

OrderUpdate.prototype.verify = function (trs, sender, cb, scope) {
	setImmediate(cb, null, trs);
}

OrderUpdate.prototype.getBytes = function (trs) {
	console.log("<3OU getBytes = " + JSON.stringify(trs));
      
    return new Buffer(trs.asset.orderId, 'utf8');
}

OrderUpdate.prototype.apply = function (trs, sender, cb, scope) {
	modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

OrderUpdate.prototype.undo = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

OrderUpdate.prototype.applyUnconfirmed = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

OrderUpdate.prototype.undoUnconfirmed = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

OrderUpdate.prototype.ready = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

OrderUpdate.prototype.save = function (trs, cb) {
	modules.api.sql.update({
        table: "asset_orders",
        modifier: {
            status: trs.asset.status
        },
        condition: {
            transactionId: trs.asset.orderId
        }
    }, cb);
}

OrderUpdate.prototype.dbRead = function (row) {
	console.log("<3OU READ = " + JSON.stringify(row));

    if (!row.o_transactionId) {
        return null;
    } else {
        return {
            orderId: row.o_transactionId,
            status: row.o_status
        };
    }
}

OrderUpdate.prototype.normalize = function (asset, cb) {
    library.validator.validate(asset, {
        type: "object",
        properties: {
            orderId: {
                type: "string",
                minLength: 1,
                maxLength: 21
            }
        },
        required: ["orderId"]
    }, cb);
}

OrderUpdate.prototype.onBind = function (_modules) {
	modules = _modules;
	modules.logic.transaction.attachAssetType(self.type, self);
}

OrderUpdate.prototype.status = function (cb, query) {
	console.log("=$OU STATUS = " + JSON.stringify(query));
    library.validator.validate(query, {
        type: "object",
        properties: {
            orderId: {
                type: "string",
                minLength: 1,
                maxLength: 21
            },
            secret: {
                type: "string",
                minLength: 1,
                maxLength: 100
            },
            status: {
                type: "number",
            }
        },
        required: ["orderId","secret","status"]
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        var keypair = modules.api.crypto.keypair(query.secret);
        modules.blockchain.accounts.setAccountAndGet({
            publicKey: keypair.publicKey.toString('hex')
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            try {
                var transaction = library.modules.logic.transaction.create({
                    type: self.type,
                    orderId: query.orderId,
                    status: query.status,
                    recipientId: query.orderId,
                    sender: account,
                    keypair: keypair
                });
            } catch (e) {
                return setImmediate(cb, e.toString());
            }

            console.log("<3OU BEFORE TRANSACTION");

            modules.blockchain.transactions.processUnconfirmedTransaction(transaction, cb);
        });
    });
}

module.exports = OrderUpdate;
