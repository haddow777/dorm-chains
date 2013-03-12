var chainFactory = require("dorm-chains")
  , dorm = require('dorm').config(__dirname+'/config.json')
  , Entity = dorm.Entity
  , F = dorm.Fields
  , Deferred = require('deferred')
  , Uuid = require('node-uuid');


module.exports["chain dorm functionality tests"] = function(beforeExit, assert) {
	var chain = chainFactory.create(),
		deferred = new Deferred(),
		primaryKey = Uuid.v1();

	var TestTable__124 = dorm.Entity.create({type:'TestTable__124', table:'test_table_124'});
	TestTable__124.define([
	    {id:F.PrimaryKeyUuidField()},
	    {value:F.IntegerField()}
	]);

	chain.addValues({primaryKey: primaryKey});


	chain.createTable(TestTable__124, function(wins){
		assert.ok(true);
	}, function(fail) { assert.ok(false); });
/*
	chain.get(TestTable__123, 1, function(wins) {
		assert.ok(true);
	}, function(fail) { assert.ok(false); });
*/
	chain.addValues({T: TestTable__124});
	chain.preSave(function(wins, vals) {
		var testTable = vals.T.create();
		testTable.id = vals.primaryKey;
		testTable.value = 777;
		console.log('Presave Uuid Types', typeof Uuid.v1(), typeof testTable.id);
		return testTable;
	});

	chain.insert(function(wins, vals) {
		assert.ok(true);
		vals.chain.addValues({test_id: wins});
		console.log('Saved Primary Key is: ', wins.id, typeof wins.id);
		vals.primaryKey = wins.id;
	}, function(fail) { assert.ok(false); });

	//chain.func(function(wins, vals) {
		chain.get(TestTable__124, primaryKey, function(wins, vals) {
			assert.ok(true);
			console.log('Get Successful: ', wins[0].values.id, ' - ', wins[0].values.value, typeof wins[0].values.id, typeof vals.primaryKey);
			deferred.resolve();
		}, function(fail) { 
			console.log('Get Failed', fail);
			assert.ok(false); 
			deferred.reject();
		});
	//});

	//chain.attachPromise(deferred.promise);

	chain.update({
		preSave: function (wins, vals) {
			assert.ok(true);
			var testTable = vals.T.create();
			testTable.id = vals.primaryKey;
			testTable.value = 888;
			return testTable;
		},
		handler: function (wins, vals) {
			assert.ok(wins.id === vals.primaryKey);
		}
	});

	//chain.func(function(wins, vals) {
		chain.get(TestTable__124, primaryKey, function(wins, vals) {
			if (wins[0].values.value === 888) {
				assert.ok(true);
				console.log('2nd Get Successful: ', wins[0].values.id, ' - ', wins[0].values.value);
				deferred.resolve();
			} else {
				console.log('Update Failed: \'value\' property was expected to be 888, but was ' + wins[0].values.value + ' instead.');
				assert.ok(false);
				deferred.reject();
			}
		}, function(fail) { 
			console.log('2nd Get Failed', fail);
			assert.ok(false); 
			deferred.reject();
		});
	//});

	//chain.attachPromise(deferred.promise);
/*
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
*/

	chain.dropTable(TestTable__124, function(wins) {
		assert.ok(true);
	}, function(fail) { assert.ok(false); });




	var promise = chain.end();

	assert.ok(typeof promise.then === 'function');
};