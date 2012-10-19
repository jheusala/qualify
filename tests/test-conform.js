/* Conform feature tests */

var testCase = require('nodeunit').testCase,
    conform = require('../src/qualify.js').conform,
	sys = require('sys');

module.exports = testCase({
	setUp: function (callback) {
		var my = this;
		
		/* Test function */
		my.foo = conform({defaults:'right',max:2, validate:[{type:'string'}]}, function(path, fn) {
			fn(undefined, "Path was " + path);
		});

		/* Test function */
		my.bar = conform({min:2, max:2, validate:[{type:'string', "required":true}]}, function(path, fn) {
		    fn(undefined, "Path was " + path);
		});

		callback();
	},
	tearDown: function (callback) {
		var my = this;
		callback();
	},
	/* Test for calling a function with right values */
	foo_1: function(test){
		test.expect(2);
		var my = this;
		my.foo("hello", function(err, results) {
			test.ok(!err, "Error: " + err);
			test.strictEqual(results, "Path was hello");
			test.done();
		});
	},
	/* Test for calling a function with right values */
	foo_2: function(test){
		test.expect(2);
		var my = this;
		my.foo(function(err, results) {
			test.ok(!err, "Error: " + err);
			test.strictEqual(results, "Path was undefined");
			test.done();
		});
	},
	/* Test for calling a function without callback */
	foo_3: function(test){
		var my = this;
		test.expect(2);
		try {
			my.foo();
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message, "No callback function");
			test.done();
		} finally {
			test.done();
		}
	},
	/* Test for calling a function without callback */
	foo_4: function(test){
		var my = this;
		test.expect(2);
		try {
			my.foo("hello", "world", function(err) {
				test.ok(!err, "Error: " + err);
			});
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message, "No callback function");
		} finally {
			test.done();
		}
	},
	/* Test for calling a function with right values */
	last: function(test){
		var my = this;
		test.done();
	}
});

/* EOF */
