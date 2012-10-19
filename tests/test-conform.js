/* Conform feature tests */

var config = require('./config.js'),
    testCase = require('nodeunit').testCase,
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

	},
	tearDown: function (callback) {
		var my = this;
	},
	/* Test for calling a function with right values */
	success_test_foo_1: function(test){
		var my = this;
		my.foo("hello", function(err, results) {
			test.ok(!err, "Error: " + err);
			test.strictEqual(results, "Path was hello");
			test.done();
		});
	},
	/* Test for calling a function with right values */
	success_test_foo_2: function(test){
		var my = this;
		my.foo(function(err, results) {
			test.ok(!err, "Error: " + err);
			test.strictEqual(results, "Path was undefined");
			test.done();
		});
	}
});

/* EOF */
