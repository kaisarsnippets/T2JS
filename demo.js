var t2js = require('./index');
str = t2js('<?@{tp1}?>', {
    incl: {
        tp1: 'var a = 1;\
        var str = @{tp2}',
        tp2: '?>Hello ${a}<?;'
    }
});
console.log(str);
