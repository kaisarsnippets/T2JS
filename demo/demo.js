var fs = require('fs');
var vm = require('vm');
var t2js = require('../t2js');

// Read template string
var tpl = fs.readFileSync('tpl.htm')+'';

// Parse
var out = t2js(tpl, {
    mode: 'tpl'
});

// Run JS in vm
out = vm.runInNewContext(out, { a: 'Hello' });

// Write output
fs.writeFileSync('out.htm', out, { mode: 0o755 });