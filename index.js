var f2m = require('fun2mod');
var tfn = require('kc-tagfun');
var mod = f2m(__dirname+'/t2.js', 'T2JS');
module.exports = function(str, cfg){
    cfg = cfg || null;
    return mod(str, cfg, tfn);
}
