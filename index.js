/**
 * T2JS - String templates to JS
 * [NodeJS only]
 * 
 * @param (string) - str: Template string
 * @param (object) - cfg: Configuration object
 * @param (function) - tagfun: Tag replacer function (kc-tagfun)
 * */
var tagfun = require('kc-tagfun');
var regesc = require('kc-regesc');
var rmcomm = require('kc-rmcomm');
var strmin = require('kc-strmin');
module.exports = function(str, cfg) {
    
    // IO String
    str = str || '';
    str = str+'';
    
    // Config
    cfg = cfg || {};
    cfg.mini = cfg.mini || false;
    cfg.incl = cfg.incl || {};
    cfg.jtag = cfg.jtag || {};
    cfg.stag = cfg.stag || {};
    cfg.itag = cfg.itag || {};
    
    // Tag definitions
    var j1 = cfg.jtag.open  || '<?';
    var j2 = cfg.jtag.close || '?>';
    var s1 = cfg.stag.open  || '${';
    var s2 = cfg.stag.close || '}';
    var i1 = cfg.itag.open  || '@{';
    var i2 = cfg.itag.close || '}';
    
    // Includes
    str = tagfun(str, i1, i2, function(c){
    return cfg.incl[c] || ''; });
    
    // Remove comments
    str = rmcomm(str);
    
    // Avoid consecutive js blocks
    var j1e = regesc(j1);
    var j2e = regesc(j2);
    var rx = j2e+'[\\s]*?'+j1e;
    rx = new RegExp(rx, 'gm');
    str = str.replace(rx, '');
    
    // Parse JS blocks
    str = tagfun(str, j2, j1, function(c){
    cfg.mini?
    c = c.replace(/\n/gm, ''):
    c = c.replace(/\n/gm, '\\n');
    return "'"+strmin(c)+"'"; });
    str = tagfun(str, j1, j2, function(c){
    return c; });
    
    // String literals
    str = tagfun(str, s1, s2, function(c){
    cfg.mini?
    c = c.replace(/\n/gm, ''):
    c = c.replace(/\n/gm, '\\n');
    return "'+("+strmin(c)+")+'"; });
    str = tagfun(str, "''+", "+''", function(c){
    return "\\''+"+c+"+'\\'"; });
    
    // Cleanup
    if (cfg.mini) str = strmin(str);
    str = str.trim();
    
    // OUT
    return str;
};
