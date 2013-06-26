var chainFactory = require("..")
  , dorm = require('dorm').config(__dirname + '/config.json')
  , Entity = dorm.Entity
  , util = require('util')
  , F = dorm.Fields;


module.exports["chain dorm functionality tests"] = function(beforeExit, assert) {
	var chain = chainFactory.create();

	var TestTable__123 = dorm.Entity.create({type:'TestTable__123', table:'test_table_123'});
	TestTable__123.define([
	    {id:F.PrimaryKeyField()},
	    {value:F.IntegerField()}
	]);


	chain.createTable(TestTable__123, function(wins){
		assert.ok(true);
	}, function(fail) { assert.ok(false); });

	chain.get(TestTable__123, 1, function(wins) {
		assert.ok(true);
	}, function(fail) { assert.ok(false); });

	chain.addValues({T: TestTable__123});
	chain.preSave(function(wins, vals) {
		var testTable = vals.T.create();
		testTable.value = 777;
		return testTable;
	});

	chain.save(function(wins, vals) {
		assert.ok(true);
		vals.chain.addValues({test_id: wins});
	}, function(fail) { assert.ok(false); });

	chain.save({
		preSave: function(wins, vals) {
			console.log('test preSave');
			var testTable = vals.T.create();
			testTable.id = 1;
			testTable.value = 999;
			return testTable;
		},
		handler: function(wins, vals) {
			assert.ok(true);
			vals.chain.addValues({test_id: wins});	
			console.log('Update Save Result = ', wins, JSON.stringify(wins), wins.id);	
		},
		err: function(fail) {
			assert.ok(false);
		}
	});

	chain.get(TestTable__123, 1, function(wins, vals) {
		//console.log('_singleEntityQuery results: ', util.inspect(results, true, 3, true));
		console.log('Record number 1 value =', wins[0].values.value);
		assert.ok(true);
	}, function(fail) { assert.ok(false); });

	chain.save({
		preSave: function(wins, vals) {
			var testTable = vals.T.create();
			testTable.value = 888;
			return testTable;
		},
		handler: function(wins, vals) {
			assert.ok(true);
			vals.chain.addValues({test_id: wins});	
			console.log('Second Save Result = ', wins, JSON.stringify(wins), wins.id);	
		},
		err: function(fail) {
			assert.ok(false);
		}
	});

	chain.dropTable(TestTable__123, function(wins) {
		assert.ok(true);
	}, function(fail) { assert.ok(false); });

	


	var self = this;

	chain.end(function() {
		self.on('exit', function() {
			assert.ok(true);
		});
		dorm.end();
	});
};