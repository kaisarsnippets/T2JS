# T2JS
String templates to JS.

## CHANGELOG
- T2JS Has been moved to its own repository (The NPM package is still there)
  - https://github.com/KaisarCode/T2JS

### Install
```
npm install t2js
```

### Simple use
```js
var t2js = require('t2js');
var minify = true;
var a = 1;
var tpl = `
var b = 2;
<?
var str = ?>
<div>Hello ${a}</div>
<div>Hello word <?+b+?></div>
<?
console.log(str);
?>
`;
str = t2js(str, minify);
console.log(str);
```

## Overview
This library is intended to simply avoid the use of string interpolation. And allow the editors highlight the code without the need to use top-edge editors (That understands extraneous file extensions).
Also, I don't want to install a bloated library or a bunch of config files to make it work.

So, by default, this only translates your JS, avoiding explicit interpolations in the code. But, I've added a little sugar to make it work similar to other templating engines.

**BUT**

This library does not executes code, you only get a string with the parsed JS that you can save to a file, or try to evaluate it if you have a secure context to do that.
Also, this is not made to save you from any thing you can code wrong.
If you use this, you have to know what you are doing.


## TPL Mode
In order to make this library behave like other TPL engines (Which is not intended to), you can pass the **mode** configuration option.
By default, the mode is "raw" (the classic mode).
But you can pass the mode "tpl". What this does is to encapsulate all the code, and then include all non-js logic into a variable and return the variable at the end.
This way, you can write HTML without define a variable and parse it between control statements.

### Use
```js
<?
var a = 1;
var b = 2;
var c = 3;
?>

<?if(a == 2){?>

<h1>Hello</h1>

<?}?>

<?if(b == 2){?>

<h1>World ${c}</h1>

<?}?>
```

After evaluating the code, you will get the following string:
```
<h1>World 3</h1>
```

## Advanced configuration
Check out the code bro.
