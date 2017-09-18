# mychess

HTML
```html
<div id="mychess-board"></div>
```
Javascript
```js
//init, one time call only
  var mc = new MyChess("mychess-board",{
  /* Default Options */
  // BoardSize : 400
  // AutoSize : true,
  //ClickEvent : true
  DragEvent : true,
  ShowPossibleMoves : true,
  ShowSqNames:true,
  //WhoIsNext:"White",
  Playing:"Both" // Black,White,Both,None
});

```
Demo Available at: http://mustafaarikan.net/mychess/board.html
