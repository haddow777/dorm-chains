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

	function fail(fail, vals) {
		console.log('Failure Detected in Chain. Fail Message:', fail);
		vals.assert.ok(false);
		vals.deferred.reject();
		process.exit();
	}

	var TestTable__124 = dorm.Entity.create({type:'TestTable__124', table:'test_table_124'});
	TestTable__124.define([
	    {id:F.PrimaryKeyUuidField()},
	    {value:F.IntegerField()},
	    {no_update:F.IntegerField()},

	]);

	chain.attachErrorHandler(fail);

	chain.addValues({primaryKey: primaryKey, deferred: deferred, assert: assert});


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
		testTable.no_update = -1;
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
			console.log('Get Successful: ', wins[0].values.id, ' - ', wins[0].values.value, ' - ', wins[0].values.no_update, typeof wins[0].values.id, typeof vals.primaryKey);
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
			return {
				where: {
					no_update: {
						cmp: '=',
						value: -1
					}
				},
				entity: testTable,
				update_set_values: true // This isn't necessary anymore as it is the default mode now
			};							// It is mostly here to show the flag for changing the behavior
		},								// of the update function. If this is set to false, it would resort
		handler: function (wins, vals) {// to the old behavior of writing all fields whether set or not.
			assert.ok(wins.id === vals.primaryKey);
		}
	});

	chain.get(TestTable__124, primaryKey, function(wins, vals) {
		if (wins[0].values.value === 888 && wins[0].values.no_update === -1) {
			assert.ok(true);
			console.log('2nd Get Successful: ', wins[0].values.id, ' - ', wins[0].values.value, ' - ', wins[0].values.no_update);
			deferred.resolve();
		} else if (wins[0].values.no_update !== -1) {
			console.log('Update Failed: \'no_update\' property was expected to be -1 after the first update, but was ' + wins[0].values.no_update + ' instead.');
			assert.ok(false);
			deferred.reject();
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


	chain.update({
		preSave: function (wins, vals) {
			assert.ok(true);
			var testTable = vals.T.create();
			testTable.id = vals.primaryKey;
			testTable.no_update = 555;
			return {
				where: {
					value: {
						cmp: '=',
						value: 888
					}
				},
				entity: testTable
			};
		},
		handler: function (wins, vals) {
			assert.ok(wins.id === vals.primaryKey);
		}
	});

	//chain.func(function(wins, vals) {
		chain.get(TestTable__124, primaryKey, function(wins, vals) {
			if (wins[0].values.no_update === 555 && wins[0].values.value === 888) {
				assert.ok(true);
				console.log('3nd Get Successful: ', wins[0].values.id, ' - ', wins[0].values.value, ' - ', wins[0].values.no_update);
				deferred.resolve();
			} else if (wins[0].values.value !== 888) {
				console.log('Update Failed: \'value\' property was expected to be 888 after the 2nd update, but was ' + wins[0].values.value + ' instead.');
				assert.ok(false);
				deferred.reject();
			}else {
				console.log('Update Failed: \'no_update\' property was expected to be 555, but was ' + wins[0].values.no_update + ' instead.');
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