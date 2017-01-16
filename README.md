# mychess

HTML
```html
<div id="mychess-board"></div>
```
Javascript
```js
//init, one time call only
var mc = new MyChess("mychess-board",{width:300});

//to reset the board to startposition
mc.start();
```