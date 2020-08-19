/**
# T2JS
String templates to JS.

## Params:
@str: [string] Template string
@cfg: [object] Configuration object
    - @otag: [string]  Open tag (dft: '<?')
    - @ctag: [string]  Close tag (dft: '?>')
    - @mini: [boolean] Minify output (dft: false)
    - @mode: [string] Switch parse mode (dft: 'raw')
*/
var t2js = (function(){
    
    function t2js(str, cfg) {
        str = str || '';
        str = str+'';
        
        // Legacy (Minify as second param)
        if (typeof cfg !== 'object') {
        var min = cfg || false;
        cfg = {}; cfg.mini = min; }
        
        // Config
        cfg = cfg || {};
        cfg.mini = cfg.mini || false;
        cfg.otag = cfg.jtag || ['<?', '?>'];
        cfg.vtag = cfg.vtag || ['${', '}'];
        cfg.itag = cfg.itag || ['@{', '}'];
        cfg.mode = cfg.mode || 'raw';
        cfg.tpls = cfg.tpls || {};
        var tplv = '_T2JSTPLV_';
        
        // Inner vars
        var otg1 = cfg.otag[0];
        var otg2 = cfg.otag[1];
        var ot1  = resc(otg1);
        var ot2  = resc(otg2);
        
        var vtg1 = cfg.vtag[0];
        var vtg2 = cfg.vtag[1];
        var vt1  = resc(vtg1);
        var vt2  = resc(vtg2);
        
        var itg1 = cfg.itag[0];
        var itg2 = cfg.itag[1];
        var it1  = resc(itg1);
        var it2  = resc(itg2);
        
        // Prepare output
        var out = '';
        var rx  = '';
        var rxs = '';
        
        var nl = '_T2JSNEWLINE_';
        
        // Includes
        function includes() {
            rx = new RegExp
            (it1+'(.*?)'+it2,'gim');
            var m = str.match(rx);
            if (m) {
                m.forEach(function(a){
                    var rx;
                    var b = '';
                    rx = new RegExp('^'+it1,'g');
                    b = a.replace(rx, '');
                    rx = new RegExp(it2+'$','g');
                    b = b.replace(rx, '');
                    b = b.replace(/\n/gm, '');
                    b = b.replace(/\\\s/gm, '');
                    b = b.replace(/\\'/gm, "'");
                    if (isdef(cfg.tpls[b])) {
                        str = str.replace(a, cfg.tpls[b], str);
                    }
                });
                includes();
            };
        }; includes();
        
        if (cfg.mini) str = strmin(str);
        str = str.replace(/\n+/g, nl);
        str += otg1+otg2;
        str += otg1+otg2;
        
        // Trim consecutive tags
        rx  = resc("+"+otg2+otg1+"+");
        rx  = new RegExp(rx, 'gm');
        str = str.replace(rx, '+');
        
        // Trim spaced consecutive tags
        rx  = resc("+"+otg2+" "+otg1+"+");
        rx  = new RegExp(rx, 'gm');
        str = str.replace(rx, "+' '+");
        
        // JS tags regex
        rxs = '';
        rxs += resc(otg1);
        rxs += '(.+?)';
        rxs += resc(otg2);
        rx = new RegExp(rxs, 'gm');
        
        // Get positions of JS tags
        var pos = [];
        while (m = rx.exec(str)) {
            var i0 = m.index;
            var i1 = rx.lastIndex;
            pos.push([i0, i1]);
        }
        var pi = 0;
        
        // Replace blocks
        pos.forEach(function(p){
            
            // HTML blocks
            var htm = str.substring(pi, p[0]);
            if (htm) {
                
                // Replace html blocks
                htm  = htm.replace(/\\/g, "\\\\");
                htm  = htm.replace(/'/g, "\\'");
                rx = new RegExp(nl, 'g');
                htm  = htm.replace(rx, "\\\n");
                htm  = "'"+htm+"';";
                htm  = htm.trim();
                
                // String literals
                var rx = new RegExp
                (vt1+'(.*?)'+vt2,'gim');
                var m = htm.match(rx);
                if (m) { m.forEach(function(a){
                    var rx;
                    var b = '';
                    rx = new RegExp('^'+vt1,'g');
                    b = a.replace(rx, '');
                    rx = new RegExp(vt2+'$','g');
                    b = b.replace(rx, '');
                    b = b.replace(/\n/gm, '');
                    b = b.replace(/\\\s/gm, '');
                    b = b.replace(/\\'/gm, "'");
                    htm = htm.replace(a, "'+("+b+")+'", str);
                })};
                
                // Add htm to tpl variable
                if (cfg.mode == 'tpl') {
                    htm = " "+tplv+"+="+htm;
                }
                
                // Out htm
                out += htm;
            }
            
            // JS blocks
            var js = str.substring(p[0], p[1]);
            if (js) {
                js = js.replace(new RegExp(ot1, 'ig'), '');
                js = js.replace(new RegExp(ot2, 'ig'), '');
                js = js.trim();
                rx = new RegExp(nl, 'g');
                js  = js.replace(rx, "\n");
                out += js;
            }
            pi = p[1];

        });
        
        // Allow tag concat in tpl mode
        rx = new RegExp(resc('+ '+tplv+'+='), 'g');
        out = out.replace(rx, '; '+tplv+'+=');
        
        // Fix special cases
        out = out.replace(/';\s?\+/ig, "'+"); // tag concat (<?+ v +?>)
        out = out.replace(/';\)/g, "')"); // fix string in function param
        out = out.replace(/';,/g, "',");  // fix string in function param
        out = out.replace(/';;/g, "';");  // fix double semicolon
        out = out.replace(/\+$/g, "");    // fix orphan concat
        
        // TPL mode encapsulation
        if (cfg.mode == 'tpl') {
            out = out.replace(/\( _T2JSTPLV_\+=/g, '(');
            out = out.replace(/return _T2JSTPLV_\+=/g, 'return ');
            out = '(function(){\nvar '+tplv+'=\'\'; '+out+' return '+tplv+'})();';
        }
        
        // Return
        return out.trim();
    }

    // Is defined
    function isdef(v) {
        return typeof v !== 'undefined';
    }

    // Regular expression escape
    function resc(str = '') {
        return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
    }
    
    // Minify
    function strmin(str) {
        str = str.replace(/\s+/g, ' ');
        str = str.trim();
        return str;
    }
    
    // Export module
    try {(typeof process !== 'undefined') &&
    (typeof process.versions !== 'undefined') &&
    (typeof process.versions.node !== 'undefined') ?
    module.exports = t2js : true; } catch (err) {};
    
    return t2js;

})();
