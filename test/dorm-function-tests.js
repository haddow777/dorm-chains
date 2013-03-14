var chainFactory = require("..");

var func_types = ['createTable', 'dropTable', 'save', 'preSave', 'get', 'delete'];

func_types.forEach(function(item, index) {
	module.exports["chain mixin grafting of dorm function: " + item] = function(beforeExit, assert) {
		var chain = chainFactory.create();
		assert.ok(typeof chain[item] === 'function');
		chain.func(function() {return true});
		chain.end();
		assert.ok(typeof chain[item] === 'function');
		this.on('exit', function() {
			assert.ok(true);
		});
	};
});

