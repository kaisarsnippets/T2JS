// T2JS
// String templates to JS
function T2JS(str, cfg) {
    
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
    
    // Remove comments
    str = str.replace
    (/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
    
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
    str = str.replace(/\s+/gm,' ');
    str = str.trim();
    str = str.replace(/''/g,'');
    str = str.replace(/\+;/g,';');
    
    // Tag replacer
    function tfn(str, tg1, tg2, fun) {
        // escape regex chars
        var rx = /[|\\{}()[\]^$+*?.-]/g;
        var t1 = tg1.replace(rx, '\\$&');
        var t2 = tg2.replace(rx, '\\$&');
        // match tags
        rx = new RegExp(t1+'(.*?)'+t2,'gm');
        var m = str.match(rx);
        // replace tags
        if (m) { m.forEach(function(a){
            var b = '';
            rx = new RegExp('^'+t1,'gim');
            b = a.replace(rx, '');
            rx = new RegExp(t2+'$','gim');
            b = b.replace(rx, '');
            str = str.replace(a, fun(b), str);
        }); str = tfn(str, tg1, tg2, fun);  };
        // return
        return str;
    };
    
    // OUT
    return str;
};
