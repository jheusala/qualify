/* Conform feature tests */

var testCase = require('nodeunit').testCase,
    conform = require('../src/qualify.js').conform,
	sys = require('sys');

module.exports = testCase({
	setUp: function (callback) {
		var my = this;
		
		/* Test function */
		my.plus = conform({
			length:2,
			validate:[{type:'number', "required":true}],
			returns:{type:'number', "required":true}
		}, function(a, b) {
			return a + b;
		});

		callback();
	},
	tearDown: function (callback) {
		var my = this;
		callback();
	},
	/* Test for calling a function with right values */
	plus_1: function(test){
		test.expect(2);
		var my = this;
		try {
			var ret = my.plus("hello", 2);
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message.substr(38, 44), "string value found, but a number is required");
		} finally {
			test.done();
		}
	},
	/* Test for calling a function without callback */
	plus_2: function(test){
		var my = this;
		test.expect(2);
		try {
			my.plus(1);
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message, "Not enough arguments!");
		} finally {
			test.done();
		}
	},
	/* Test for calling a function without callback */
	plus_3: function(test){
		var my = this;
		test.expect(2);
		try {
			var ret = my.plus(1, 2, 3);
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message, "Too many arguments!");
		} finally {
			test.done();
		}
	},
	plus_4: function(test){
		test.expect(1);
		var my = this;
		var ret = my.plus(1, 2);
		test.strictEqual(ret, 3);
		test.done();
	},
});

/* EOF */
