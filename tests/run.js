#!/usr/bin/env node
try {
    var reporter = require('nodeunit').reporters.default;
}
catch(e) {
    console.log("Cannot find nodeunit module.");
    console.log("You can download submodules for this project by doing:");
    console.log("");
    console.log("    npm install -d");
    console.log("");
    process.exit();
}

process.chdir(__dirname);
reporter.run(['test-conform.js']); // TODO: Automate selection of all test-*.js ?
