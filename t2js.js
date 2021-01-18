// T2JS - Template 2 JS
var t2js = (function(){
    
    // Regex escape
    function rgs(st) {
    var rx = /[|\\{}()[\]^$+*?.-]/gm;
    return st.replace(rx, '\\$&');}
    
    // Tag replacer
    function tfn(st, tg1, tg2, fun) {
    t1 = rgs(tg1); t2 = rgs(tg2);
    var rx = t1+'([\\s\\S]*?)'+t2;
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
        
        // Force trailing tags
        str = j1+j2+str+j1+j2;
        
        // Set a literal string
        str = tfn(str, '!'+j2, j1, function(c){
            c = c.replace(/\n/gm, '\\n');
            c = c.replace(/'/gm, "\\'");
            return "'"+c+"';";
        });
        
        // Return strings
        str = tfn(str, '='+j2, j1, function(c){
            c = c.replace(/\n/gm, '\\n');
            c = c.replace(/'/gm, "\\'");
            return "return '"+c+"';";
        });
        
        // Concatenate strings using js tagss
        str = tfn(str, j1+'=', j2, function(c){
            return s1+c+s2;
        });
        
        // Parse JS blocks
        str = tfn(str, j2, j1,
        function(c){
            c = c.replace(/\n/gm, '\\n');
            c = c.replace(/'/gm, "\\'");
            c = ov+"+='"+c+"';";
            return c;
        });
        
        // trim trailing tags
        str = tfn(str, j1, j2,
        function(c){ return c });
        
        // Concatenate strings
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
