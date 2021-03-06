/* Conform feature tests */

var testCase = require('nodeunit').testCase,
    conform = require('../src/qualify.js').conform,
	sys = require('sys');

module.exports = testCase({
	setUp: function (callback) {
		var my = this;
		
		/* Test function */
		my.foo = conform({
			type: 'async',
			defaults:'right',
			max:2,
			validate:[
				{type:'string'},
				{type:'function', "required":true}
			]
		}, function(path, fn) {
			fn(undefined, "Path was " + path);
		});

		/* Test function */
		my.bar = conform({
			type: 'async',
			length:2,
			validate:[
				{type:'string', "required":true},
				{type:'function', "required":true}
			]
		}, function(path, fn) {
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
		} finally {
			test.done();
		}
	},
	/* Test for calling a function without callback */
	foo_4: function(test){
		var my = this;
		test.expect(2);
		try {
			my.foo("hello");
		} catch(e) {
			test.ok(e instanceof TypeError, "Exception was not TypeError!");
			test.strictEqual(e.message, "No callback function");
		} finally {
			test.done();
		}
	},
	/* Test for calling a function without callback */
	foo_5: function(test){
		var my = this;
		test.expect(2);
		my.foo("hello", "world", function(err) {
			test.ok(err, "There was no error!");
			test.strictEqual(err.substr(0, 30), "TypeError: Too many arguments!");
			test.done();
		});
	},
	/* Test for calling a function without callback */
	bar_1: function(test){
		var my = this;
		test.expect(2);
		my.bar(function(err) {
			test.ok(err, "There was no error!");
			test.strictEqual(err.substr(0, 32), "TypeError: Not enough arguments!");
			test.done();
	    });
	},
	/* Test for calling a function with right values */
	last: function(test){
		var my = this;
		test.done();
	}
});

/* EOF */
