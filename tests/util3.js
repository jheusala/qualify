/* Tests for callback utilities */

var conform = require('../src/qualify.js').conform;

/* Test functions */


/* Test function */
var foo = conform({defaults:'right',max:2, validate:[{type:'string'}]}, function(path, fn) {
	fn("Path was " + path);
});

/* Test function */
var bar = conform({min:2, max:2, validate:[{type:'string', "required":true}]}, function(path, fn) {
	fn("Path was " + path);
});




/* Next we test it */
var test_id = 1;


try {

	console.log('### test ' + (test_id++) + ' ###'); // 1

	foo("hello", function(err) {
		console.log(err);
	});
	
	console.log('### test ' + (test_id++) + ' ###'); // 2

	foo(function(err) {
		console.log(err);
	});
	
	console.log('### test ' + (test_id++) + ' ###'); // 3

	foo();

} catch(e) {
	console.log("Exception: " + e + " (" + e.stack + ")");
}

console.log('### test ' + (test_id++) + ' ###'); // 4
try {
	foo("hello");
} catch(e) {
	console.log("Exception: " + e + " (" + e.stack + ")");
}

console.log('### test ' + (test_id++) + ' ###'); // 5
try {
	foo("hello", "world", function(err) {
		if(err) {
			console.log("Error: " + err);
		}
	});
} catch(e) {
	console.log("Exception: " + e+ " (" + e.stack + ")");
}

console.log('### test ' + (test_id++) + ' ###'); // 6
try {
	bar(function(err) {
		if(err) {
			console.log("Error: " + err);
		}
	});
} catch(e) {
	console.log("Exception: " + e+ " (" + e.stack + ")");
}


/* EOF */
