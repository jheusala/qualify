/* Conform feature tests */

var testCase = require('nodeunit').testCase,
    conform = require('../src/qualify.js').conform,
	sys = require('sys');

module.exports = testCase({
	setUp: function (callback) {
		var my = this;
		
		/* Test function */
		my.foo = conform({
			length:1,
			validate:[{type:'string', "required":true}],
			returns:{type:'string', "required":true}
		}, function(path) {
			return path + ' world';
		});

		/* Test function */
		my.bar = conform({
			length:1,
			validate:[{type:'string', "required":true}],
			returns:{type:'string', "required":true}
		}, function(path) {
			return 1;
		});

		callback();
	},
	tearDown: function (callback) {
		var my = this;
		callback();
	},
	/* Test for calling a function with right values */
	foo_1: function(test){
		test.expect(1);
		var my = this;
		var ret = my.foo("hello");
		test.strictEqual( ret, "hello world" );
		test.done();
	},
	/* Test for calling a function without callback */
	foo_2: function(test){
		var my = this;
		test.expect(2);
		try {
			my.foo();
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message, "Not enough arguments!");
		} finally {
			test.done();
		}
	},
	/* Test for calling a function without callback */
	foo_3: function(test){
		var my = this;
		test.expect(2);
		try {
			var ret = my.foo("hello", "world");
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message, "Too many arguments!");
		} finally {
			test.done();
		}
	},
	/* Test for calling a function with right values */
	bar_1: function(test){
		var my = this, ret;
		test.expect(2);
		try {
			ret = my.bar("hello");
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message.substr(41, 44), "number value found, but a string is required");
		} finally {
			test.done();
		}
	}
});

/* EOF */
