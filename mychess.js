function myChess(elemid){
	this.elemid =elemid;
	this.playing = "White";
	this.dragPiece = null;

	this.init = function(){
		this.sqColors(elemid);
		this.startPosition();
		document.onmousedown = this.OnMouseDown;
    	document.onmouseup = this.OnMouseUp;
	}
	this.sqColors = function () {
		var mainboard = document.getElementById("mychess-board"),
		rownumber = 0;
		this.sqs = mainboard.getElementsByClassName("board-sq");
		for (var i = 0; i < 64; i++) {
			if(i%8==0)rownumber++;
			if ( ( rownumber%2==0 && i%2==0 ) ||( rownumber%2==1 && i%2==1 ) )  this.sqs[i].classList.add("dark");
			else  this.sqs[i].classList	.add("light");
		};
	}
	this.startPosition = function () {
		this.putPiece(0,"BlackRook");
		this.putPiece(7,"BlackRook");
		this.putPiece(1,"BlackKnight");
		this.putPiece(6,"BlackKnight");
		this.putPiece(2,"BlackBishop");
		this.putPiece(5,"BlackBishop");
		this.putPiece(3,"BlackQueen");
		this.putPiece(4,"BlackKing");
		for (var i = 8; i < 16; i++) {
			this.putPiece(i,"BlackPawn");
		};

		this.putPiece("a1","WhiteRook");
		this.putPiece(63,"WhiteRook");
		this.putPiece(57,"WhiteKnight");
		this.putPiece(62,"WhiteKnight");
		this.putPiece(58,"WhiteBishop");
		this.putPiece(61,"WhiteBishop");
		this.putPiece(59,"WhiteQueen");
		this.putPiece(60,"WhiteKing");
		for (var i = 48; i < 56; i++) {
			this.putPiece(i,"WhitePawn");
		};
	}
	this.putPiece =function(sq,name){
		if(!Number.isInteger(sq)) sq = this.getRowId(sq);
		this.sqs[sq].innerHTML = "<img draggable='true' src='./img/pcs/"+name+".png' class='board-pcs drag' />";
	}
	this.removePiece =function(sq,name){
		if(!Number.isInteger(sq)) sq = this.getRowId(sq);
		this.sqs[sq].innerHTML = "";
	}
	this.getRowId = function(foo){
		var factor;
		switch (foo[0]){
			case 'a' : factor=7 ;break;
			case 'b' : factor=6 ;break;
			case 'c' : factor=5 ;break;
			case 'd' : factor=4 ;break;
			case 'e' : factor=3 ;break;
			case 'f' : factor=2 ;break;
			case 'g' : factor=1 ;break;
			case 'h' : factor=0 ;break;
			default : console.error("Unexpected string");
		}
		return ( (factor * 8)+ (parseInt(foo[1])-1) );
		
	}
	
	this.init();
	return this;
}
var mc = new myChess("mychess-board");