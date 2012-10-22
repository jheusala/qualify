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
		type: 'async',
		defaults: 'right',
		max: 2, 
		validate: [{type:'string'}]
	}, function(path, fn) {
		fn("Path was " + path);
	});

Options for `conform` are:

* `type` - The type of the function. Possible values are: 
** `basic` - default, this is standard function,
** `async` - Basic async function: last argument must be a function that takes first argument as an optional error message
** `promise` - Will return a promise object (CommonJS/PromiseA). [Not implemented yet.]
* `defaults` - If set as `right` then all optional arguments are fulfilled from right to left
* `max` and `min` or `length` - how many arguments the function must have. `length` will override `max` and `min` as the same value.
* `validate` - An array of schemas that will be used to specify how arguments are validated. Optional arguments should be set as `undefined`.
* `returns` - will validate the return value of the function in a schema format

Notes about our schema validation
---------------------------------

The library uses [json-schema](https://github.com/kriszyp/json-schema) to validate JavaScript objects. As an exception `conform` also supports `{type:'function'}` with 
support for optional `required` field. (However at the moment it does not support functions outside top level.)

Other methods
-------------

`qualify.isFunction(what)` returns true if `what` is a function. 

`qualify.isObject(what)` returns true if `what` is an object. 

`qualify.validate(what, schema)` is the same as `JSONSchema.validate()` except it has extended support for `type:'function'`. Returns an object in format `{valid:true|false, errors:[]}`.

