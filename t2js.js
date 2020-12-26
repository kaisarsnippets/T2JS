// T2JS - Template 2 JS
var t2js = (function(){
    
    // Regex escape
    function rgs(st) {
    var rx = /[|\\{}()[\]^$+*?.-]/gm;
    return st.replace(rx, '\\$&');}
    
    // Tag replacer
    function tfn(st, tg1, tg2, fun) {
    t1 = rgs(tg1); t2 = rgs(tg2);
    rx = t1+'([\\s\\S]*?)'+t2;
    rx = new RegExp(rx,'gim');
    return st.replace(rx,
    function(a,c){return fun(c)})}
    
    // Main function
    return function(str, opt) {
        
        // Config
        opt = opt || {};
        opt.j1 = opt.j1 || '<?';
        opt.j2 = opt.j2 || '?>';
        opt.s1 = opt.s1 || '${';
        opt.s2 = opt.s2 || '}';
        
        // Define vars
        var j1 = opt.j1;
        var j2 = opt.j2;
        var s1 = opt.s1;
        var s2 = opt.s2;
        var j1e = rgs(j1);
        var j2e = rgs(j2);
        var ov = '_T2OUT';
        
        // Force open tag
        str = j1+str;
        
        // Force close tags
        str = str+j1+j2;
        
        // Return shortcut
        rx = new RegExp('R'+j2e, 'gm');
        str = str.replace(rx, 'return '+j2);
        
        // Output shortcut
        rx = new RegExp('O'+j2e, 'gm');
        str = str.replace(rx, ov+'+= '+j2);
        
        // Avoid consecutive js
        rx = j1e+'[\\s]*?'+j1e;
        rx = new RegExp(rx, 'gm');
        str = str.replace(rx, j1);
        
        rx = j2e+'[\\s]*?'+j2e;
        rx = new RegExp(rx, 'gm');
        str = str.replace(rx, j2);
        
        rx = j2e+'[\\s]*?'+j1e;
        rx = new RegExp(rx, 'gm');
        str = str.replace(rx, '');
        
        // Parse JS blocks
        str = tfn(str, j2, j1,
        function(c){
        c = c.replace(/\n/gm, '\\n');
        c = c.replace(/'/gm, "\\'");
        return "'"+c+"';"});
        
        // Remove first and last tags
        str = tfn(str, j1, j2,
        function(c){ return c });
        
        // Parse string literals
        str = tfn(str, s1, s2, function(c){
        c = c.replace(/\\n/gm, "");
        c = c.replace(/\\'/gm, "'");
        return "'+("+c+")+'" });
        
        // Encapsulate code
        str = "var "+ov+"='';\n\n"+str;
        str = str+" return "+ov+";";
        str = "(function(){\n"+str+"\n})();";
        
        // Cleanup
        str = str.replace(/\+''/g,'');
        str = str.replace(/;;/g,';');
        str = str.replace(/;:/g,":");
        str = str.replace(/;\+/g,'+');
        str = str.replace(/';\)/g,"')");
        
        // Return
        return str;
    }
})();
