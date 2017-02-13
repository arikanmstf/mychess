# mychess

HTML
```html
<div id="mychess-board"></div>
```
Javascript
```js
//init, one time call only
mc = new MyChess("mychess-board",{
				/* Default Options */
				// BoardSize : 400
				// AutoSize : true
				// ShowPossibleMoves : false
				// DragEvent : false
				// ClickEvent : true
			});

//to set size of the board, use setSize(); , default Size 100%	;
mc.setSize(700);
```