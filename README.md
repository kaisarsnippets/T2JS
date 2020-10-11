# T2JS
[NodeJS] String templates to JS.

### Install
```
npm install t2js
```

### Use
```js
var t2js = require('t2js');
str = t2js('<?@{tp1}?>', {
    incl: {
        tp1: 'var a = 1;\
        var str = @{tp2}',
        tp2: '?>Hello ${a}<?;'
    }
});
console.log(str);
```
