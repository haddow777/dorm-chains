
var Client = require('pg').Client,
	client = new Client("postgres://user_dev:dev@localhost:5432/ebt_dev");

client.connect();

module.exports["chain dorm transaction tests"] = function(beforeExit, assert) {

client.query("begin;", function(err, result) {
	console.log('begin finished');
	if (!err) {
	} else {
		console.log('error in begin');
		assert.ok(false);
	}
});
setTimeout(function() {
		
    client.query("savepoint first;", function (err, result) {
    	if (err) {
    		console.log("error in savepoint");
    		assert.ok(false);
    	} else {
    		console.log('savepoint set');
    	}
    });
}, 500);
setTimeout(function() {
		
    client.query("select raise_notice();", function (err, result) {
    	if (err) {
    		console.log("error in raise_notice()");
    		assert.ok(false);
    	} else {
    		console.log('procedure call finished');
    	}
    });
}, 1000);
setTimeout(function() {
		
    client.query("rollback to first;", function (err, result) {
    	if (err) {
    		console.log("error in rollback to");
    		assert.ok(false);
    	} else {
    		//done();
    		console.log('rollback successful');
    	}
    });
}, 1500);
setTimeout(function() {
		
    client.query("commit;", function (err, result) {
    	if (err) {
    		console.log("error in commit");
    		assert.ok(false);
    	} else {
    		console.log('commit finished');
    	}
    });
}, 2000);
setTimeout(function() {
	client.end();
}, 2500);

assert.ok(true);
};