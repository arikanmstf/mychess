# mychess

HTML
```html
<div id="mychess-board"></div>
```
Javascript
```js
//init, one time call only
var mc = new MyChess("mychess-board",{
	BoardSize:300
});


//to set size of the board, use setSize(); , default Size 100%	;
mc.setSize(700);
```