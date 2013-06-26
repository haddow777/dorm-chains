var chainFactory = require("..")
  , dorm = require('dorm').config(__dirname + '/config.json')
  , Entity = dorm.Entity
  , util = require('util')
  , F = dorm.Fields;


module.exports["chain dorm transaction tests"] = function(beforeExit, assert) {
	var chain = chainFactory.create();

	var TestTable__125 = dorm.Entity.create({type:'TestTable__125', table:'test_table_125'});
	TestTable__125.define([
	    {id:F.PrimaryKeyField()},
	    {value:F.IntegerField()}
	]);


	chain.createTable(TestTable__125, function(wins){
		assert.ok(true);
	}, function(fail) { assert.ok(false); });

	chain.get(TestTable__125, 1, function(wins) {
		assert.ok(true);
	}, function(fail) { assert.ok(false); });

	chain.addValues({T: TestTable__125});

	chain.begin();

	chain.preSave(function(wins, vals) {
		var testTable = vals.T.create();
		testTable.value = 777;
		return testTable;
	});

	chain.save(function(wins, vals) {
		assert.ok(true);
		vals.chain.addValues({test_id: wins});
	}, function(fail) { assert.ok(false); });

	chain.savepoint("first");

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

	chain.savepoint("second");

	chain.get(TestTable__125, 1, function(wins, vals) {
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

	chain.rollbackTo('second');
	chain.func(function(){console.log('after rollbackTo but before commit');});
	chain.commit();
	chain.func(function(){console.log('after commit');});

	chain.dropTable(TestTable__125, function(wins) {
		console.log('dropTable successfull');
		assert.ok(true);
	}, function(fail) { 
		console.log('dropTable failed');
		assert.ok(false); 
	});

	chain.runStoredProcedure('raise_notice()');

	


	var self = this;

	chain.end(function() {
		dorm.end();
		console.log('ending the chain');
		assert.ok(true);
	});
};