var chainsFactory = require("chains"),
	promises = require('dorm').promises;

var dorm_chain = {};

function out () { return ''; } //This is just a bridge for a function that is being removed

function error_handler_creator(type, vals, err) {
	var handler, error_handler;
	if (typeof err === 'function') {
		error_handler = err;
	} 
	else if (typeof vals.err === 'function'){
		error_handler = vals.err;
	} 
	else {
		error_handler = function(fail, vals) {
			console.log(type + ' failed for ', fail);
		}
	}
	handler = function (fail) {
		var values = vals;
		out(type + ' error handler');
		console.log('Augmented dorm-chains Fail Handler executed', fail);
		return error_handler(fail, values);
	};
	return handler;
}

dorm_chain.createTable = function (entity, handler, err) {
	var self = this, vals = this.values;
	var error_handler;
	if (typeof err === 'function'){
		error_handler = err;
	} 
	else {
		error_handler = function(fail) {
			out('createTable error handler');
			console.log('createTable failed for ' + entity.type, fail);
		}
	}
	error_handler = error_handler_creator('createTable', vals, err);
	if (this.promise === undefined) {
		this.promise = promises.createTable(entity);
		//this.promise = this.promise.then(function(win) { out('createTable'); return 1; }, error_handler);
	} 
	else {
		this.promise = this.promise.then(function(win) { out('createTable'); return promises.createTable(entity); }, error_handler);
	}
	if (typeof handler === 'function') {
		this.promise = this.promise.then(function(win) { out('createTable handler'); handler(win, vals); return 1; }, function(fail) { console.log('createTable custom handler failed: ' + entity.type, fail); });
	}

};

dorm_chain.dropTable = function (entity, handler, err) {
	var self = this, vals = this.values;
	var error_handler;
	if (typeof err === 'function'){
		error_handler = err;
	} 
	else {
		error_handler = function(fail) {
			out('dropTable error handler');
			console.log('dropTable failed for ' + entity.type);
		}
	}
	error_handler = error_handler_creator('dropTable', vals, err);
	if (this.promise === undefined) {
		//console.log('dropTables undefined - ', counter);
		this.promise = promises.dropTable(entity);
		//this.promise = this.promise.then(function(win) { out('dropTable'); return 1; }, error_handler);
	} 
	else {
		//console.log('dropTables defined - ', counter, this.promise, this);
		this.promise = this.promise.then(function(win) { out('dropTable'); return promises.dropTable(entity); }, error_handler);
	}
	if (typeof handler === 'function') {
		this.promise = this.promise.then(function(win) { out('dropTable handler'); handler(win, vals); return 1; }, function(fail) { console.log('dropTable custom handler failed: ' + entity.type, fail); });
	}
};

dorm_chain.get = function (type, options, handler, err) {
	var self = this, vals = this.values;
	var error_handler;
	if (typeof err === 'function'){
		error_handler = err;
	} 
	else {
		error_handler = function(fail) {
			out('get error handler');
			console.log('get failed for ', fail);// + entity.type, entity.values, fail);
		}
	}
	error_handler = error_handler_creator('get', vals, err);
	if (this.promise === undefined) {
		this.promise = promises.get(type, options);
		this.promise = this.promise.then(function(win) { out('get'); return win; }, error_handler);
	} 
	else {
		this.promise = this.promise.then(function(win) {  
			return promises.get(type, options); 
		}, error_handler);
	}
	if (typeof handler === 'function') {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return 1;
			}
			out('get handler'); 
			handler(win, vals); 
			return 1; 
		}, function(fail) { console.log('get custom handler failed: ', fail );});
	}
};

dorm_chain.delete = function (options, handler, err) {
	var self = this, vals = this.values;
	var error_handler;
	if (typeof err === 'function'){
		error_handler = err;
	} 
	else {
		error_handler = function(fail) {
			out('delete error handler');
			console.log('delete failed for ', fail);// + entity.type, entity.values, fail);
		}
	}
	error_handler = error_handler_creator('delete', vals, err);
	if (this.promise === undefined) {
		this.promise = promises.delete(options);
		this.promise = this.promise.then(function(win) { out('delete'); return win; }, error_handler);
	} 
	else {
		this.promise = this.promise.then(function(win) { 
			//out('save'); console.log('PRESAVE WIN VALUE', util.inspect(win, true, 3, true)); 
			return promises.delete(options); 
		}, error_handler);
	}
	if (typeof handler === 'function') {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return 1;
			}
			out('delete handler'); 
			handler(win, vals); 
			return 1; 
		}, function(fail) { console.log('delete custom handler failed: ', fail );});
	}
};

dorm_chain.save = function (handlers, err) {
	var self = this, vals = this.values;
	var error_handler,
		handler;
	if (typeof handlers === 'function') {
		handler = handlers;
	} else if (typeof handlers === 'object' && handlers !== null) {
		if (typeof handlers.preSave === 'function') {
			this.preSave(handlers.preSave);
		}
		handler = handlers.handler;
	}
	if (typeof err === 'function'){
		error_handler = err;
	} else if (handlers && typeof handlers.err === 'function') {
		error_handler = handlers.err;
	} else {
		error_handler = function(fail) {
			out('save error handler');
			console.log('save failed for ', fail);// + entity.type, entity.values, fail);
		}
	}
	error_handler = error_handler_creator('save', vals, err);
	if (this.promise === undefined) {
		this.promise = promises.save(entity);
		this.promise = this.promise.then(function(win) { out('save'); return win; }, error_handler);
	} 
	else {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return false;
			}
			//out('save'); console.log('PRESAVE WIN VALUE', util.inspect(win, true, 3, true)); 
			return promises.save(win); 
		}, error_handler);
	}
	if (typeof handler === 'function') {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return 1;
			}
			out('save handler'); 
			handler(win, vals); 
			return 1; 
		}, function(fail) { console.log('save custom handler failed: ', fail );});
	}
};

dorm_chain.insert = function (handlers, err) {
	var self = this, vals = this.values;
	var error_handler,
		handler;
	if (typeof handlers === 'function') {
		handler = handlers;
	} else if (typeof handlers === 'object' && handlers !== null) {
		if (typeof handlers.preSave === 'function') {
			this.preSave(handlers.preSave);
		}
		handler = handlers.handler;
	}
	if (typeof err === 'function'){
		error_handler = err;
	} else if (handlers && typeof handlers.err === 'function') {
		error_handler = handlers.err;
	} else {
		error_handler = function(fail) {
			out('insert error handler');
			console.log('insert failed for ', fail);// + entity.type, entity.values, fail);
		}
	}
	error_handler = error_handler_creator('insert', vals, err);
	if (this.promise === undefined) {
		this.promise = promises.insert(entity);
		this.promise = this.promise.then(function(win) { out('insert'); return win; }, error_handler);
	} 
	else {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return false;
			}
			//out('insert'); console.log('PRESAVE WIN VALUE', util.inspect(win, true, 3, true)); 
			return promises.insert(win); 
		}, error_handler);
	}
	if (typeof handler === 'function') {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return 1;
			}
			out('insert handler'); 
			handler(win, vals); 
			return 1; 
		}, function(fail) { console.log('insert custom handler failed: ', fail );});
	}
};

dorm_chain.update = function (handlers, err) {
	var self = this, vals = this.values;
	var error_handler,
		handler;
	if (typeof handlers === 'function') {
		handler = handlers;
	} else if (typeof handlers === 'object' && handlers !== null) {
		if (typeof handlers.preSave === 'function') {
			this.preSave(handlers.preSave);
		}
		handler = handlers.handler;
	}
	if (typeof err === 'function'){
		error_handler = err;
	} else if (handlers && typeof handlers.err === 'function') {
		error_handler = handlers.err;
	} else {
		error_handler = function(fail) {
			out('update error handler');
			console.log('update failed for ', fail);// + entity.type, entity.values, fail);
		}
	}
	error_handler = error_handler_creator('update', vals, err);
	if (this.promise === undefined) {
		this.promise = promises.update(entity);
		this.promise = this.promise.then(function(win) { out('update'); return win; }, error_handler);
	} 
	else {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return false;
			}
			//out('update'); console.log('PRESAVE WIN VALUE', util.inspect(win, true, 3, true)); 
			return promises.update(win); 
		}, error_handler);
	}
	if (typeof handler === 'function') {
		this.promise = this.promise.then(function(win) { 
			if (win === false) {
				return 1;
			}
			out('update handler'); 
			handler(win, vals); 
			return 1; 
		}, function(fail) { console.log('update custom handler failed: ', fail );});
	}
};

//Deprecated
dorm_chain.preSave = function(func, err) {
	var self = this, vals = this.values;
	var error_handler = error_handler_creator('preSave', vals, err);
	if (this.promise === undefined) {
		this.func(func);
		console.log("RUNNING PRESAVE FUNCTION OUTSIDE CHAIN");
	} 
	else {
		//this.promise = this.promise.then(function(win) {out('preSave count add'); console.log('*******-----------------'); console.log('presave count add ', count); console.log('*******-----------------');}, function(fail) {console.log('presave count add failed')});
		//this.promise = this.promise.then(function(win) { out('preSave func'); func(); return 1; }, function(fail) { out('preSave error handler'); console.log('preSave failed ', func, fail); });
		this.promise = this.promise.then(function(win) {out('preSave func'); return func(win, vals); }, error_handler);
	} 
}

var dormChainsFactory = {
	create: function (options) {
		if (options === undefined) {
			options = {};
		}
		if (options.mixins === undefined) {
			options.mixins = dorm_chain;
		} else {
			for (property in dorm_chain) {
				options.mixins[property] = dorm_chain[property];
			}
		}
		return chainsFactory.create(options);
	}
}


module.exports = dormChainsFactory;