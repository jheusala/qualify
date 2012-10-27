qualify
=======

JavaScript library to help building functions and methods with qualification 
checks for specific conditions.

License
-------

License is MIT.

Usage with Node.js
------------------

Install using NPM:

	npm install qualify

Use it in the application:

	var qualify = require('qualify');

Method `qualify.create`
-----------------------

`qualify.create` can be used to build functions and methods that validate their arguments and return values.

### Example

You can create functions like this:

	var foo = qualify.create({
		type: 'async',
		defaults: 'right',
		max: 2, 
		validate: [{type:'string'}]
	}, function(path, fn) {
		fn("Path was " + path);
	});

...and it would be same as something like this:

	var foo = function(path, fn) {
		try {
			// ... Handle arguments ...
			
			// Actual code block here
			fn("Path was " + path);

		} catch(e) {
			// ... handle exceptions ...
		}
	};

### `type`

The type of the function's error handling. This is required if you use differend styles of error handling and want to use those styles to catch conform's errors too.

Possible values are: 

* `"basic"` is the default option. This is a standard function. Conform's errors are handled by throwing exceptions.
* `"async"` is a basic async function. Last argument must be a function which can be called with an argument as an optional error message.
* `"asyncValidate"` Validate arguments for the asynchronous function call based on this schema. [''Note:'' Not implemented yet.]
* `"promise"` the function will return a Promise object (CommonJS/PromiseA). [''Note:'' Not implemented yet.]

### `defaults`

The direction of fulfilling missing arguments. If set as `"right"` then all optional arguments are fulfilled from right to left. This is optional argument. Default is `"left"`.

### `max` and `min` or `length`

How many arguments the function must have. `length` will override `max` and `min` as the same value.

### `validate`

An array for each schema that will be used to specify how arguments are validated. Optional arguments should be set as `undefined`.

### `returns`

Validate the return value of the function in our schema format.

Notes about our schema validation
---------------------------------

The library uses [json-schema](https://github.com/kriszyp/json-schema) to validate JavaScript objects. As an exception `conform` also supports `{type:'function'}` with 
support for optional `required` field. (However at the moment it does not support functions outside top level.)

Other methods
-------------

### `qualify.isFunction(what)`

Returns `true` if `what` is a function. 

### `qualify.isObject(what)`

Returns `true` if `what` is an object. 

### `qualify.validate(what, schema)`

Is the same as `JSONSchema.validate()` except it has extended support for `{type:'function'}`. Returns an object in format `{valid:true|false, errors:[]}`.

