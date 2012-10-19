qualify
=======

JavaScript library to help building functions and methods with qualification 
checks for specific conditions.

License
-------

License is MIT.

Installation
------------

	npm install qualify

Examples
--------

Usage with Node.js:

	var conform = require('qualify').conform;

Declare your functions like:

	var foo = conform({
		defaults: 'right',
		max: 2, 
		validate: [{type:'string'}]
	}, function(path, fn) {
		fn("Path was " + path);
	});

Settings are:

* defaults setting declares that optional arguments are fulfilled from right to left
* max and min settings declare how many arguments the function can have
* validate setting uses JSON schema format to specify how arguments are accepted. undefined validations are ignored.
