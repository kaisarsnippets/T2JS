// Export module
var fl = './t2.js';
var fs = require('fs');
var vm = require('vm');
var run = vm.runInThisContext;
run(fs.readFileSync(fl)+'');
module.exports = T2JS;
