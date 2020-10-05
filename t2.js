// T2JS
// String templates to JS
function T2JS(str, cfg) {
    str = str || '';
    str = str+'';
    
    cfg = cfg || {};
    cfg.mini = cfg.mini || false;
    cfg.jtag = cfg.jtag || {};
    cfg.jtag = cfg.jtag.open = '<?';
    cfg.jtag = cfg.jtag.close = '?>';
    cfg.ptag = cfg.ptag || {};
    cfg.ptag = cfg.ptag.open = '${';
    cfg.ptag = cfg.ptag.close = '}';
    cfg.itag = cfg.itag || {};
    cfg.itag = cfg.itag.open = '@{';
    cfg.itag = cfg.itag.close = '}';
    cfg.tpls = cfg.tpls || {};
    
    var jt1 = cfg.jtag.open;
    var jt1r = resc(jt1);
    var jt2 = cfg.jtag.close;
    var jt2r = resc(jt2);
    
    var pt1 = cfg.ptag.open;
    var pt1r = resc(pt1);
    var pt2 = cfg.ptag.close;
    var pt2r = resc(pt2);
    
    var it1 = cfg.itag.open;
    var it1r = resc(it1);
    var it2 = cfg.itag.close;
    var it2r = resc(it2);
    
    var rx;
    var rxs;
    var out;
    var tv = '_T2JSTPLV_';
    var nl = '_T2JSNEWLINE_';
    
    
    /*** Helper functions ******************************************* */
    
    // Is defined
    function isdef(v) {
        return typeof v !== 'undefined';
    };
    
    // Regular expression escape
    function resc(str = '') {
        var rx = /[|\\{}()[\]^$+*?.-]/g;
        return str.replace(rx, '\\$&');
    };
    
    // Minify
    function strmin(str) {
        str = str.replace(/\s+/g, ' ');
        str = str.trim(); return str;
    };
    
    // Remove comments
    function rmcomm(str) {
        var rx = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
        str = str.replace(rx, ''); return str;
    };
    
    /*** Export module ********************************************** */
    try {(typeof process !== 'undefined') &&
    (typeof process.versions !== 'undefined') &&
    (typeof process.versions.node !== 'undefined') ?
    module.exports = t2js : true; } catch (err) {};
}
