// T2JS - [NodeJS] String templates to JS
var tagfun = require('kc-tagfun');
var regesc = require('kc-regesc');
var rmcomm = require('kc-rmcomm');
var strmin = require('kc-strmin');
module.exports = function(str, cfg) {
    var rx; var outv = '_T2OUT_';
    
    // IO String
    str = str || '';
    str = str+'';
    
    // Config
    cfg = cfg || {};
    cfg.mini = cfg.mini || false;
    cfg.mode = cfg.mode || 'tpl';
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
    var j1e = regesc(j1);
    var j2e = regesc(j2);
    
    // Force close tags
    str = str+j1+j2;
    
    // Includes
    str = tagfun(str, i1, i2, function(c){
    return cfg.incl[c] || ''; });
    
    // Tag shortcuts
    rx = new RegExp('R'+j2e, 'gm');
    str = str.replace(rx, 'return '+j2);
    if (cfg.mode == 'tpl') {
    rx = new RegExp('O'+j2e, 'gm');
    str = str.replace(rx, outv+'+= '+j2); }
    
    // Avoid consecutive js blocks
    rx = j2e+'[\\s]*?'+j1e;
    rx = new RegExp(rx, 'gm');
    str = str.replace(rx, '');
    
    // Parse JS blocks
    str = tagfun(str, j2, j1, function(c){
        cfg.mini?
        c = c.replace(/\n/gm, ''):
        c = c.replace(/\n/gm, '\\n');
        c = c.replace(/'/gm, "\\'");
        // Parse string literals
        c = tagfun(c, s1, s2, function(c){
            c = c.replace(/\\'/gm, "'");
            return "'+("+c+")+'"
        }); return "'"+strmin(c)+"';";
    });
    
    // Remove first and last tags
    str = tagfun(str, j1, j2, function(c){
        return c;
    });
    
    // Encapsulate code
    if (cfg.mode == 'tpl') {
    str = "var "+outv+"='';\n\n"+str;
    str = str+" return "+outv+";"; }
    str = "(function(){\n"+str+"\n})();";
    
    // Cleanup
    if (cfg.mini) str = rmcomm(str);
    if (cfg.mini) str = strmin(str);
    str = str.trim();
    str = str.replace(/\+''/g,'');
    str = str.replace(/;;/g,';');
    str = str.replace(/;\+/g,'+');
    
    // OUT
    return str;
};
