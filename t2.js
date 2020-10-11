/**
 * T2JS - String templates to JS
 * 
 * @param (string) - str: Template string
 * @param (object) - cfg: Configuration object
 * @param (function) - tfn: Tag replacer function (kc-tagfun)
 * */
function T2JS(str, cfg, tfn) {
    
    // IO String
    str = str || '';
    str = str+'';
    
    // Config
    cfg = cfg || {};
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
    str = tfn(str, i1, i2, function(c){
    return cfg.incl[c] || ''; });
    
    // Separate strings
    str = j2+str+j1;
    str = tfn(str, j2, j1, function(c){
    return "'"+c+"'"; });
    
    // String literals
    str = tfn(str, s1, s2, function(c){
    return "'+("+c+")+'"; });
    
    // Minify and cleanup
    str = str.replace
    (/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
    str = str.replace(/\s+/gm,' ');
    str = str.trim();
    str = str.replace(/''/g,'');
    str = str.replace(/\+;/g,';');
    
    // OUT
    return str;
};
