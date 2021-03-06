/* Utilities for function handling */

"use strict";

/* TODO: Support for checking argument types. This could even read the source code comment tags and build checks based on documented features. */

/* for node-lint */
/*global Buffer: false, clearInterval: false, clearTimeout: false, console: false, global: false, module: false, process: false, querystring: false, require: false, setInterval: false, setTimeout: false, util: false, __filename: false, __dirname: false */

var mod = module.exports = {},
	foreach = require('snippets').foreach,
	JSONSchema = require('json-schema');

/** Returns true if the argument is a function */
mod.isFunction = function(f) {
	return f && (typeof f === 'function');
};

/** Returns true if the argument is an object */
mod.isObject = function(f) {
	return f && (typeof f === 'object');
};

/** Validate `f` based on `schema`. */
mod.validate = function(f, schema) {
	if(schema === undefined) {
		return {valid:true, errors:[]};
	}
	if(!mod.isObject(schema)) {
		return {valid:false, errors:[{'message':'Schema was invalid'}]};
	}
	if(schema.type === 'function') {
		if( (!schema.required) && (!f) ) {
			return;
		}
		if(!mod.isFunction(f)) {
			return {valid:false, errors:[{'message':'Object was not a function.'}]};
		}
		return {valid:true, errors:[]};
	}
	return JSONSchema.validate(f, schema);
};

/** */
function debug_stringify (what) {
	var cases = {
		'numger': function(w) { return ''+ w; },
		'string': function(w) { return '"' + w + '"'; },
		'undefined': function(w) { return 'undefined'; },
		'function': function(w) {
			return ''+w;
		},
		'object': function(w) {
			var ret = [], type;
			if(w instanceof Array) {
				type = 'Array';
				foreach(w).each(function(item) {
					ret.push(debug_stringify(item));
				});
				return '[' + ret.join(', ') + ']';
			} else {
				type = 'Object';
				foreach(w).each(function(item, key) {
					ret.push(key + ':' + debug_stringify(item));
				});
				return '{' + ret.join(', ') + '}';
			}
		}
	}, c;
	c = cases[typeof what];
	if(c === undefined) {
		return typeof what + '('+JSON.stringify(what) +')';
	}
	return c(what);
}

/* Conforms argument list in reverse order and verifies that first (which was original last defined argument) is an function.
 * @param args Argument list as array.
 * @returns Returns argument list in reverse order. First element is the callback function.
 */
function do_conform(args, opts) {
	function prettify(e) {
		var msg = ""+e;
		if(e.fileName) {
			msg += " [" + e.fileName;
			if(e.lineNumber) {
				msg += ":" + e.lineNumber;
			}
			msg += "]";
		}
		if (e.stack) {
			msg += '\n====== stack ======\n';
			msg += e.stack + "\n";
		}
		return msg;
	}
	var arg, fn, validate, opts_max_length, defaults_direction;
	try {
		args = Array.prototype.slice.call(args);

		opts = opts || {};
		validate = opts.validate || [];
		opts_max_length = opts.max || args.length;
		defaults_direction = opts.defaults || 'left';
		
		opts.type = opts.type || 'basic';
		
		if(opts.length) {
			opts.min = opts.length;
			opts.max = opts.length;
		}

		if(!opts.min) {
			opts.min = 0;
		}
		
		// First priority to search for the callback function
		if(opts.type === 'async') {
			(function(){
				if(args.length < 1) {
					return;
				}
				var i = args.length - 1;
				for(; i >= 0; i -= 1) {
					if(!mod.isFunction(args[i])) {
						//throw new TypeError("Last argument is not valid function!");
						return;
					}
					fn = args[i];
					return;
				}
			}());
		}
		
		// Pad args from left (with undefined) if the direction to set defaults is from right
		if( opts.max && (defaults_direction === 'right') ) {
			while(args.length < opts.max) {
				args.unshift(undefined);
			}
		}
		
		// Create default error handler if fn is undefined
		if( (opts.type === 'async') && (!mod.isFunction(fn)) ) {
			throw new TypeError("No callback function");
		}
		
		// Check states

		/*
		if(args.length < 1) {
			throw new TypeError("No callback function found!");
		}
		*/
		
		if(opts.min && (args.length < opts.min) ) {
			throw new TypeError("Not enough arguments!");
		}
		
		if(opts.max && (args.length > opts.max) ) {
			throw new TypeError("Too many arguments!");
		}
		
		// Check validate
		if(!(validate instanceof Array)) {
			throw new TypeError("opts.validate must be an Array!");
		} else if(validate.length !== 0) {
			(function(){
				var i = 0;
				
				function do_loop(){
					var result, msgs = [];
					result = mod.validate(args[i], validate[i]);
					if(!result.valid) {
						foreach(result.errors).each(function(p) {
							msgs.push( ((p.property !== undefined) ? 'property="' + p.property : '') + '", ' + p.message );
						});
						throw new TypeError("Argument #" + i + " was invalid: " + msgs.join('; ') + " (schema was " + debug_stringify(validate[i]) + ")");
					}
				}
				
				// Check args with each schema from validate
				for(; i < validate.length; i += 1) {
					do_loop();
				}
			}());
		}
		
		return args;
	} catch(e) {
		if(mod.isFunction(fn)) {
			fn(prettify(e));
		} else {
			throw e;
		}
	}
}

/* Conformed function builder */
mod.conform = function(opts, fn) {
	if(!mod.isFunction(fn)) {
		throw new TypeError("Second argument for conform must be an function.");
	}
	var retfn = function() {
		var obj = this,
		    max_length = opts.max || arguments.length,
		    args = do_conform(arguments, opts),
		    ret;
		if(!args) {
			return;
		}
		//args.reverse();
		//while(args.length < max_length) {
		//	args.unshift(undefined);
		//}
		ret = fn.apply(obj, args);
		
		// FIXME: Check return value based on opts.returns
		if(opts.returns) {
			(function() {
				var result, msgs = [];
				result = mod.validate(ret, opts.returns);
				if(!result.valid) {
					foreach(result.errors).each(function(p) {
						msgs.push( ((p.property !== undefined) ? 'property="' + p.property : '') + '", ' + p.message );
					});
					throw new TypeError("Returned value was invalid: " + msgs.join('; ') + " (schema was " + debug_stringify(opts.returns) + ")");
				}
			}());
		}
		
		return ret;
	};
	return retfn;
};

mod.create = mod.conform;

/* EOF */
