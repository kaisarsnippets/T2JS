// T2JS - [NodeJS] String templates to JS
var tagfun = require('kc-tagfun');
var regesc = require('kc-regesc');
var rmcomm = require('kc-rmcomm');
var strmin = require('kc-strmin');
module.exports = function(str, cfg) {
    var rx;
    
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
    var j1e = regesc(j1);
    var j2e = regesc(j2);
    var s1e = regesc(s1);
    var s2e = regesc(s2);
    
    // Force close tags
    str = str+j1+j2;
    
    // Includes
    str = tagfun(str, i1, i2, function(c){
    return cfg.incl[c] || ''; });
    
    // Tag shortcuts
    rx = new RegExp('r'+j2e, 'gm');
    str = str.replace(rx, 'return '+j2);
    
    // Avoid consecutive js blocks
    rx = j2e+'[\\s]*?'+j1e;
    rx = new RegExp(rx, 'gm');
    str = str.replace(rx, '');
    
    // Avoid consecutive literals
    rx = s2e+'[\\s]*?'+s1e;
    rx = new RegExp(rx, 'gm');
    str = str.replace(rx, '+""+');
    
    // Parse JS blocks
    str = tagfun(str, j2, j1, function(c){
        cfg.mini?
        c = c.replace(/\n/gm, ''):
        c = c.replace(/\n/gm, '\\n');
        
        // Parse string literals
        c = tagfun(c, s1, s2, function(c){
            return "'+("+c+")+'"
        }); return "'"+strmin(c)+"'";
    });
    
    // Remove first and last tags
    str = tagfun(str, j1, j2, function(c){
        return c;
    });
    
    // Cleanup
    if (cfg.mini) str = rmcomm(str);
    if (cfg.mini) str = strmin(str);
    str = str.trim();
    str = str.replace(/\+''/g,'');
    
    // OUT
    return str;
};
