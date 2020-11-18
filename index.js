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
    cfg.min = cfg.min || false;
    cfg.mod = cfg.mod || 'tpl';
    cfg.jtg = cfg.jtg || {};
    cfg.stg = cfg.stg || {};
    
    // Tag definitions
    var j1 = cfg.jtg.o || '<?';
    var j2 = cfg.jtg.c || '?>';
    var s1 = cfg.stg.o || '${';
    var s2 = cfg.stg.c || '}';
    var j1e = regesc(j1);
    var j2e = regesc(j2);
    
    // Force close tags
    str = str+j1+j2;
    
    // Tag shortcuts
    rx = new RegExp('R'+j2e, 'gm');
    str = str.replace(rx, 'return '+j2);
    if (cfg.mod == 'tpl') {
    rx = new RegExp('O'+j2e, 'gm');
    str = str.replace(rx, outv+'+= '+j2); }
    
    // Avoid consecutive js blocks
    rx = j2e+'[\\s]*?'+j1e;
    rx = new RegExp(rx, 'gm');
    str = str.replace(rx, '');
    
    // Parse JS blocks
    str = tagfun(str, j2, j1, function(c){
        cfg.min?
        c = c.replace(/\n/gm, ''):
        c = c.replace(/\n/gm, '\\n');
        c = c.replace(/'/gm, "\\'");
        return "'"+strmin(c)+"';";
    });
    
    // Remove first and last tags
    str = tagfun(str, j1, j2, function(c){
        return c;
    });
    
    // Parse string literals
    str = tagfun(str, s1, s2, function(c){
        c = c.replace(/\\n/gm, "");
        c = c.replace(/\\'/gm, "'");
        return "'+("+c+")+'"
    });
    
    // Encapsulate code
    if (cfg.mod == 'tpl') {
    str = "var "+outv+"='';\n\n"+str;
    str = str+" return "+outv+";"; }
    str = "(function(){\n"+str+"\n})();";
    
    // Cleanup
    if (cfg.min) str = rmcomm(str);
    if (cfg.min) str = strmin(str);
    str = str.trim();
    str = str.replace(/\+''/g,'');
    str = str.replace(/;;/g,';');
    str = str.replace(/;\+/g,'+');
    str = str.replace(/';\)/g,"')");
    
    // OUT
    return str;
};
