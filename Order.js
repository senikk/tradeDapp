var private = {}, self = null,
	library = null, modules = null;

var States = {
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
	return trs;
}

Order.prototype.calculateFee = function (trs) {
	return 0;
}

Order.prototype.verify = function (trs, sender, cb, scope) {
	setImmediate(cb, null, trs);
}

Order.prototype.getBytes = function (trs) {
	return null;
}

Order.prototype.apply = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

Order.prototype.undo = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

Order.prototype.applyUnconfirmed = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

Order.prototype.undoUnconfirmed = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

Order.prototype.ready = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

Order.prototype.save = function (trs, cb) {
	setImmediate(cb);
}

Order.prototype.dbRead = function (row) {
	return null;
}

Order.prototype.normalize = function (asset, cb) {
	setImmediate(cb);
}

Order.prototype.onBind = function (_modules) {
	modules = _modules;
	modules.logic.transaction.attachAssetType(self.type, self);
}

module.exports = Order;
