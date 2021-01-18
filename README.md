# T2JS
[nodejs] A simple templating engine inspired in PHP.

### Install
```
npm install t2js
```
## Example
```js
var t2js = require('t2js');

var tpl = `
THE MEANING OF LIFE IS: <?
var x = 42;
function meaning(n) {
    =?>\${n}<?
}?>\${meaning(x)}
`;

var out = t2js(tpl);
console.log(out);

console.log(eval(out));
```
### Usage
The idea is to write the templates like PHP does, except that the reult
is not printed on screen, but returned for you to be processed as needed.

Every time some code is found inside the **<?** and **?>** tags (JS tags),
the content will be treated as JavaScript. Everything outside those tags,
will be appended to a variable and returned at the end.

If a **!?>** tag is found, the content will not be appended to the global
string, but treated as a stand alone string.

If a **=?>** tag is found, the content will not be appended to the global
string, but treated as a returned value instead.

If a **<?=** tag is found, the content will be concatenated to the string.
Also, you can concatenate using the tags **${** and **}** (String tags);

The tags can be configured passing the options to the t2js function:
```js
// Change them by any other you want
t2js(tpl, {
    j1: '<?',
    j2: '?>',
    s1: '${',
    s2: '}'
});
```

That's it.
