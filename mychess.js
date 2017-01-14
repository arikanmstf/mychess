function MyChess(elemid){
	var _self = this;
	this.elemid =elemid;
	this.playing = "White";
	this.downPlayer = "White";
	this.Pieces = [];
	var drag = {
		element:null,
		startX : 0,
		startY : 0,
		offsetX : 0,
		offsetY : 0,
		oldZIndex : 0
	}
	function MyChessPiece(opts){
		this.SquareID = opts.SquareID;// 0-63
		this.SquareName = opts.SquareName; // a1-h8
		this.Color = opts.Color;//White,Black
		this.Element = opts.Element; // HTML DOM Element
		this.Type = null; //Pawn,Rook,Knight,Bishop,Queen,King
		this.isLegalMove = function(){console.info("Called abstract function  : isLegalMove()");return false;}
	}
	function MyChessPawn(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Pawn";
		this.isLegalMove = function (old,_new){
			console.log(old,_new)
			var color=this.Color,r= 
			( (_self.downPlayer=="White" && color=="Black" ) || (_self.downPlayer=="Black" && color=="White") ) ? 
				( ( _new == old+8 || ((old>=8 && old<16 && _self.Pieces[_new-8].Element.innerHTML=="") ? (_new == old+16):false )) && _new <64 && _self.Pieces[_new].Element.innerHTML=="" ) || ( (_new==old+7 || _new==old+9) && _new<64 && _self.Pieces[_new].Element.innerHTML!="") ||  isEnPassant(): 
				( ( _new == old-8 || ((old>=48 && old<56) ? (_new == old-16  && _self.Pieces[_new+8].Element.innerHTML==""):false )) && _new <64 && _self.Pieces[_new].Element.innerHTML=="") || ( (_new==old-7 || _new==old-9) && _new<64 && _self.Pieces[_new].Element.innerHTML!="") || isEnPassant();
			
			return r;
		}
		function isEnPassant(){
			return false;
		}
	}
	function MyChessRook(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Rook";
		this.isLegalMove = function(old,_new){
			var r =true;
			console.log(old,_new)
			if( (old - _new)% 8 ==0 ){
				if(old>_new){
					for (var i=old-8; i > _new; i-=8) {
						if(_self.Pieces[i].Element.innerHTML!="") {
							r=false;
							break;
						}
					}
				}
				else if(old<_new){
					for (var i=old+8; i < _new; i+=8) {
						if(_self.Pieces[i].Element.innerHTML!="") {
							r=false;
							break;
						}
					}
				}
				
			}
			else if( (parseInt(old/8)==parseInt(_new/8)) ){
				if(old>_new){
					for (var i=old-1; i > _new; i--) {
						if(_self.Pieces[i].Element.innerHTML!="") {
							r=false;
							break;
						}
					};
				}
				else if(old<_new){
					for (var i=old+1; i < _new; i++) {
						if(_self.Pieces[i].Element.innerHTML!="") {
							r=false;
							break;
						}
					}
				}
			}
			else if(isCastling()){
				r=true;
			}
			else {
				r = false;
			}
			return r;
			
		}
		function isCastling(){
			return false;
		}
	}
	function MyChessKnight(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Knight";
		this.isLegalMove = function(old,_new){
			var dif = (old-_new);
			return ( (dif == 10) || (dif == -10) ||
				(dif == 6) || (dif == -6) ||
				(dif == 15) || (dif == -15) || 
				(dif == 17) || (dif == -17) ) ;
		}
	}
	function MyChessBishop(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Bishop";
	}
	function MyChessQueen(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Queen";
	}
	function MyChessKing(){
		MyChessPiece.apply(this,arguments);
		this.Type = "King";
	}
	
	this.init = function(){
		this.mainboard  = document.getElementById(elemid),
		rownumber = 0;
		
		sqColors();
		this.startPosition();
		this.mainboard.addEventListener ("mousedown", OnMouseDown,false);
		function sqColors() {
			var sqs = _self.mainboard.getElementsByClassName("board-sq");
			for (var i = 0; i < 64; i++) {
					if(i%8==0)rownumber++;
					if ( ( rownumber%2==0 && i%2==0 ) ||( rownumber%2==1 && i%2==1 ) )  sqs[i].classList.add("dark");
					else  sqs[i].classList	.add("light");
					_self.Pieces.push(
						new MyChessPiece({Element:sqs[i]})
					);
				};
		}
	}
	this.startPosition = function () {
		this.putPiece(0,"Rook","Black");
		this.putPiece(7,"Rook","Black");
		this.putPiece(1,"Knight","Black");
		this.putPiece(6,"Knight","Black");
		this.putPiece(2,"Bishop","Black");
		this.putPiece(5,"Bishop","Black");
		this.putPiece(3,"Queen","Black");
		this.putPiece(4,"King","Black");
		for (var i = 8; i < 16; i++) {
			this.putPiece(i,"Pawn","Black");
		};

		this.putPiece(56,"Rook","White");
		this.putPiece(63,"Rook","White");
		this.putPiece(57,"Knight","White");
		this.putPiece(62,"Knight","White");
		this.putPiece(58,"Bishop","White");
		this.putPiece(61,"Bishop","White");
		this.putPiece(59,"Queen","White");
		this.putPiece(60,"King","White");
		for (var i = 48; i < 56; i++) {
			this.putPiece(i,"Pawn","White");
		};
	}
	this.putPiece =function(sq,type,color){
		if(!Number.isInteger(sq)) sq = getRowId(sq);
		
		var opts = {
			SquareID:sq,
			Color:color,
			Element:this.Pieces[sq].Element
		}
		switch(type){
			case 'Pawn' : this.Pieces[sq] = ( new MyChessPawn(opts)); break;
			case 'Rook' : this.Pieces[sq] = ( new MyChessRook(opts)); break;
			case 'Knight' : this.Pieces[sq] = ( new MyChessKnight(opts)); break;
			case 'Bishop' : this.Pieces[sq] = ( new MyChessBishop(opts)); break;
			case 'Queen' : this.Pieces[sq] = ( new MyChessQueen(opts)); break;
			case 'King' : this.Pieces[sq] = ( new MyChessKing(opts)); break;
		}
		
		this.Pieces[sq].Element.innerHTML = "<img draggable='true' src='./img/pcs/"+color+type+".png' class='board-pcs' pccolor="+color+" sqid="+sq+" pctype="+type+" />";
	}
	this.removePiece =function(sq){
		if(!Number.isInteger(sq)) sq = getRowId(sq);
		this.Pieces[sq].Element.innerHTML = "";
	}
	this.movePiece = function(old,_new){
		if(!Number.isInteger(old)) old = getRowId(old);
		if(!Number.isInteger(_new)) _new = getRowId(_new);
		//
		this.putPiece(_new,this.Pieces[old].Type,this.Pieces[old].Color);
		this.Pieces[old]= new MyChessPiece({Element:this.Pieces[old].Element});
		this.Pieces[old].Element.innerHTML = "";
	}
	
	this.moveCompleted = function(e){
		
		var target = e.target,old = parseInt( target.getAttribute("sqid") ),
		_new = (parseInt(e.clientY/50)*8) + (parseInt(e.clientX/50))
		if(old==_new){this.moveCanceled(target);return false;}
		if(isNaN(old))return false;

		var oldpc = (this.Pieces[_new].Element.getElementsByClassName("board-pcs")[0] );
		if(oldpc != undefined && oldpc.getAttribute("pccolor") == this.playing){
			this.moveCanceled(target);return false;
		} 
		if(target.getAttribute("pccolor")!=this.playing){this.moveCanceled(target);return false;}
		if(e.clientX >400 || e.clientY >400){
			this.moveCanceled(target);return false;
		}
		target.style.left =0+"px";
		target.style.top =0+"px";
		target.style.zIndex =drag.oldZIndex;
		target.setAttribute("sqid", _new);
		this.movePiece(old,_new);
		if(this.playing=="White")this.playing="Black";
		else this.playing="White";
	}
	this.moveCanceled = function(target){
		target.style.left =0+"px";
		target.style.top =0+"px";
		target.style.zIndex =drag.oldZIndex;
	}

	OnMouseMove = function(e){
		_self.mainboard.addEventListener ("mouseup", OnMouseUp,false);
    	if (e == null) var e = window.event; 
    	if(drag.element != null){
   			drag.element.style.left = (drag.offsetX + e.clientX - drag.startX) + 'px';
    		drag.element.style.top = (drag.offsetY + e.clientY - drag.startY) + 'px';
    	}
    }
	OnMouseUp = function(e){
		drag = {
			element:null,
			startX : 0,
			startY : 0,
			offsetX : 0,
			offsetY : 0,
			oldZIndex : 0
		}
		_self.mainboard.removeEventListener ("mousemove" , OnMouseMove , false);
    	_self.mainboard.removeEventListener ("mouseup" , OnMouseUp , false);

    	var old =  makeNumber(e.target.getAttribute("sqid")),
		_new = (parseInt(e.clientY/50)*8) + (parseInt(e.clientX/50));
		
    	if(_self.Pieces[old].isLegalMove(old,_new)){
    		_self.moveCompleted(e);
    	}else{
    		_self.moveCanceled(e.target);
    	}
	}

	OnMouseDown =function (e){
		_self.mainboard.addEventListener ("mousemove", OnMouseMove,false);
    	if (e == null) e = window.event; 
    	var target = e.target != null ? e.target : e.srcElement;
    	if(target==null)return false;
    	if ((e.button == 1 && window.event != null || 
        e.button == 0) && target.className == 'board-pcs'){
        	drag.startX = e.clientX;
        	drag.startY = e.clientY;
        
	        drag.offsetX = makeNumber(target.style.left);
    	    drag.offsetY = makeNumber(target.style.top);
        
        	drag.oldZIndex = target.style.zIndex;
        	target.style.zIndex = 10000;
        
        	drag.element = target;
        	document.addEventListener("onmousemove" , OnMouseMove,false);
        	document.onselectstart = function () { return false; };
        	target.ondragstart = function() { return false; };
        	return false;
    	}
	}
	makeNumber=function(v){
    	var n = parseInt(v);
		return n == null || isNaN(n) ? 0 : n;
	}
	getRowId = function(foo){
		if(Number.isInteger(foo))return foo;
		
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
			default : {console.error("Unexpected string : "+foo);if(isNaN(foo)) return false;}
		}
		return ( (factor * 8)+ (parseInt(foo[1])-1) );
	}
	this.init();
	return this;
}
var mc = new MyChess("mychess-board");