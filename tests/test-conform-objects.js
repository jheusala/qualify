/* Conform feature tests */

var testCase = require('nodeunit').testCase,
    conform = require('../src/qualify.js').conform,
	sys = require('sys');

module.exports = testCase({
	setUp: function (callback) {
		var my = this;
		
		function TestObj(msg) {
			this._msg = ''+msg;
		}
		
		/* Test method1 */
		TestObj.prototype.get = conform({min:1,max:1}, function(fn) {
			fn(undefined, this._msg);
		});

		/* Test method2 */
		TestObj.prototype.set = conform({min:2, max:2, validate:[{type:'string', "required":true}]}, function(msg, fn) {
			this._msg = ''+msg;
			fn(undefined, this._msg);
		});

		my.obj = new TestObj("1234ABCD");
		
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
		my.obj.set("hello", function(err, results) {
			test.ok(!err, "Error: " + err);
			test.strictEqual(results, "hello");
			test.done();
		});
	},
	/* Test for calling a function with right values */
	foo_2: function(test){
		test.expect(2);
		var my = this;
		my.obj.get(function(err, results) {
			test.ok(!err, "Error: " + err);
			test.strictEqual(results, "1234ABCD");
			test.done();
		});
	},
	/* Test for calling a function without callback */
	foo_3: function(test){
		var my = this;
		test.expect(2);
		my.obj.set("hello", "world", function(err) {
			test.ok(err, "There was no error!");
			test.strictEqual(err.substr(0, 30), "TypeError: Too many arguments!");
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
