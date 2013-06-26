
var pg = require('pg');


module.exports["chain dorm transaction tests"] = function(beforeExit, assert) {

	var connectionString = "postgres://user_dev:dev@localhost:5432/ebt_dev";
	
	pg.connect(connectionString, function (err, client, done) {
		console.log('starting');
        client.query("begin;", function(err, result) {
        	console.log('begin finished');
        	if (!err) {
        		done();
        	} else {
        		console.log('error in begin');
        		assert.ok(false);
        		done();
        	}
        });
    });
    setTimeout(function() {
	pg.connect(connectionString, function (err, client, done) {
		
        client.query("savepoint first;", function (err, result) {
        	if (err) {
        		console.log("error in savepoint");
        		assert.ok(false);
        	} else {
        		done();
        		console.log('savepoint set');
        	}
        });
    });
}, 500);
setTimeout(function() {
	pg.connect(connectionString, function (err, client, done) {
		
        client.query("select raise_notice();", function (err, result) {
        	if (err) {
        		console.log("error in raise_notice()");
        		assert.ok(false);
        	} else {
        		done();
        		console.log('procedure call finished');
        	}
        });
    });
}, 1000);
setTimeout(function() {
	pg.connect(connectionString, function (err, client, done) {
		
        client.query("rollback to first;", function (err, result) {
        	if (err) {
        		console.log("error in rollback to");
        		assert.ok(false);
        	} else {
        		done();
        		console.log('rollback successful');
        	}
        });
    });
}, 1500);
setTimeout(function() {
	pg.connect(connectionString, function (err, client, done) {
		
        client.query("commit;", function (err, result) {
        	if (err) {
        		console.log("error in commit");
        		assert.ok(false);
        	} else {
        		console.log('commit finished');
        	}
        	done();
        	pg.end();
        });
    });
}, 2000);
	var self = this;

assert.ok(true);
};