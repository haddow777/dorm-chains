var chainFactory = require("..");



module.exports["loop test"] = function(beforeExit, assert) {
	var chain = chainFactory.create();
	chain.startLoop();
	chain.func(function(win, vals) {assert.ok(vals.count === 0);});
	chain.next();
	chain.func(function(win, vals) {assert.ok(vals.count === 1);});
	chain.endLoop();
	chain.func(function(win, vals) {assert.ok(vals.count === undefined);});
	assert.ok(typeof chain.end().then === 'function');

	var self = this;

	chain.end(function() {
		self.on('exit', function() {
			assert.ok(true);
		});
	});
};

module.exports["test test"] = function(beforeExit, assert) {
	assert.ok(true);
	this.on('exit', function() {
		assert.ok(true);
	});
};