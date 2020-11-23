# T2JS
[NodeJS] String templates to JS.

### Install
```
npm install t2js
```

### Usage
```js
var t2js = require('t2js');

var tpl = `
<?
var dummy = 'lorem ipsum';
function printMsg(msg) {R?>
    <strong>{{msg}}</strong>
<?}
?>

<?O?>
<div>
    {{printMsg(dummy)}}
</div>
`;
str = t2js(tpl, {
    st1: '{{',
    st2: '}}'
});

console.log(str);
```
