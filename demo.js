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
    st1: '{{',
    st2: '}}'
});

console.log(str);
