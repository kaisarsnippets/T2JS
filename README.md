# T2JS
[NodeJS] String templates to JS.

### Install
```
npm install t2js
```

### Usage
```js
var t2js = require('./index');

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
    min: true,
    cfg: {
        stg:{ o:'{{', c:'}}' }
    }
});

console.log(str);
```
