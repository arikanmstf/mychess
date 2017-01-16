function MyChess(elemid){
	var _self = this;
	this.elemid =elemid;
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
	MyChessPawn.prototype = Object.create(MyChessPiece.prototype);
	MyChessBishop.prototype = Object.create(MyChessPiece.prototype);
	MyChessRook.prototype = Object.create(MyChessPiece.prototype);
	MyChessKnight.prototype = Object.create(MyChessPiece.prototype);
	MyChessBishop.prototype = Object.create(MyChessPiece.prototype);
	MyChessQueen.prototype = Object.create(MyChessPiece.prototype);
	MyChessKing.prototype = Object.create(MyChessPiece.prototype);

	function MyChessPiece(opts){
		this.SquareID = opts.SquareID;// 0-63
		this.SquareName = opts.SquareName; // a1-h8
		this.Color = opts.Color;//White,Black
		this.Element = opts.Element; // HTML DOM Element
		this.Type = ""; //Pawn,Rook,Knight,Bishop,Queen,King
		this.NeverMoved = true; // true,false

		MyChessPiece.prototype.copy = function() {
			var opts = {
				SquareID:this.SquareID,
				Color : this.Color,
				Element : this.Element
			}
			switch(this.Type){
				case 'Pawn' : return ( new MyChessPawn(opts)); break;
				case 'Rook' : return ( new MyChessRook(opts)); break;
				case 'Knight' : return (new MyChessKnight(opts));break;
				case 'Bishop' : return(new MyChessBishop(opts)); break;
				case 'Queen' : return (new MyChessQueen(opts)); break;
				case 'King' : return ( new MyChessKing(opts));break;
				default : return new MyChessPiece(opts);
			}

		};
		this.__construct = function(){
			if(this.Type != ""){
				this.Element.innerHTML = "<img draggable='true' src='./img/pcs/"+this.Color+this.Type+".png' class='board-pcs' pccolor="+this.Color+" sqid="+this.SquareID+" pctype="+this.Type+" />";
			}
		}
		this.isLegalMove = function(){console.info("Called abstract function  : isLegalMove()");return false;}
		this.isUnderAttack = function(exceptThatColor){
			if(typeof exceptThatColor == undefined || !exceptThatColor){
				exceptThatColor = "";
			}
			for (var i = 0; i < _self.Pieces.length; i++) {
				if(_self.Pieces[i].Type=="" || _self.Pieces[i].Color == this.Color || _self.Pieces[i].SquareID == this.SquareID ||_self.Pieces[i].Color==exceptThatColor){continue;}

				if(_self.Pieces[i].isLegalMove(this.SquareID)){
					return true;
				}

			};
			return false;
		}
		this.isKinginDanger = function(_new){
			var _tempObj , _tempObj2 ,old = this.SquareID,color = this.Color;

			_tempObj = this.copy();
			_tempObj2 = _self.Pieces[_new].copy();

			_self.Pieces[_new] = this.copy();
			_self.Pieces[_new].SquareID = _new;

			_self.Pieces[old] = new MyChessPiece({SquareID:old});
			
			if(_self.GamePlay[color].King.isUnderAttack(color)){
				_self.Pieces[_new] = _tempObj2.copy();
				_self.Pieces[old] = _tempObj.copy();
				return true;
			}
			_self.Pieces[_new] = _tempObj2.copy();
			_self.Pieces[old] = _tempObj.copy();
			return false;
		}
	}
	function MyChessPawn(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Pawn";
		this.__construct();
		this.isLegalMove = function (_new){
			var old = this.SquareID, color=this.Color,r= 
			( (_self.downPlayer=="White" && color=="Black" ) || (_self.downPlayer=="Black" && color=="White") ) ? 
				( ( _new == old+8 || ((old>=8 && old<16 && _self.Pieces[_new-8].Type=="") ? (_new == old+16):false )) && _new <64 && _self.Pieces[_new].Type=="" ) || ( (_new==old+7 || _new==old+9) && _new<64 && _self.Pieces[_new].Type!="" && (parseInt(old/8)-parseInt(_new/8) ) ==-1) ||  isEnPassant(): 
				( ( _new == old-8 || ((old>=48 && old<56) ? (_new == old-16  && _self.Pieces[_new+8].Type==""):false )) && _new <64 && _self.Pieces[_new].Type=="") || ( (_new==old-7 || _new==old-9) && _new<64 && _self.Pieces[_new].Type!="" && (parseInt(old/8)-parseInt(_new/8) ) ==1 ) || isEnPassant();
			
			return r;
		}
		function isEnPassant(){
			return false;
		}
	}
	function MyChessRook(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Rook";
		this.__construct();
		this.isLegalMove = function(_new){
			var old = this.SquareID, r =true;
			if( (old - _new)% 8 ==0 ){
				if(old>_new){
					for (var i=old-8; i > _new; i-=8) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					}
				}
				else if(old<_new){
					for (var i=old+8; i < _new; i+=8) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					}
				}
				
			}
			else if( (parseInt(old/8)==parseInt(_new/8)) ){
				if(old>_new){
					for (var i=old-1; i > _new; i--) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					};
				}
				else if(old<_new){
					for (var i=old+1; i < _new; i++) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					}
				}
			}
			else {
				r = false;
			}
			return r;
			
		}
		
	}
	function MyChessKnight(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Knight";
		this.__construct();
		this.isLegalMove = function(_new){
				var old = this.SquareID,dif = (old-_new);
				return ( (dif == 10) || (dif == -10) ||
				(dif == 6) || (dif == -6) ||
				(dif == 15) || (dif == -15) || 
				(dif == 17) || (dif == -17) ) ;
		}
	}
	function MyChessBishop(){
		MyChessPiece.apply(this,arguments);
		this.Type = "Bishop";
		this.__construct();
		this.isLegalMove = function(_new){
			var r = true,old=this.SquareID;
			if( (old - _new) % 9 ==0 && _self.Pieces[_new].Element.getAttribute("sqcolor")==_self.Pieces[old].Element.getAttribute("sqcolor") ){
				if(old>_new){
					for (var i=old-9; i > _new; i-=9) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					}
				}
				else if(old<_new){
					for (var i=old+9; i < _new; i+=9) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					}
				}
			}
			else if( (old - _new) % 7 ==0 && _self.Pieces[_new].Element.getAttribute("sqcolor")==_self.Pieces[old].Element.getAttribute("sqcolor") ){
				if(old>_new){
					for (var i=old-7; i > _new; i-=7) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					}
				}
				else if(old<_new){
					for (var i=old+7; i < _new; i+=7) {
						if(_self.Pieces[i].Type!="") {
							r=false;
							break;
						}
					}
				}
			}else{
				r = false;
			}
			return r;
		}
	}
	function MyChessQueen(){
		MyChessBishop.apply(this,arguments);
		this.iLMB = this.isLegalMove; 
		MyChessRook.apply(this,arguments);
		this.iLMR = this.isLegalMove;

		this.isLegalMove = function(_new){
			return (
				this.iLMR(_new) ||
				this.iLMB(_new) 
			);
		}
		this.Type = "Queen";
		this.__construct();
		
	}
	function MyChessKing(){
		MyChessPiece.apply(this,arguments);
		this.Type = "King";
		this.__construct();
		this.isLegalMove = function(_new){

			var old = this.SquareID, dif = old- _new;
			//
			return (
				(dif==1) || (dif==-1) ||
				(dif==7) || (dif==-7) ||
				(dif==8) || (dif==-8) ||
				(dif==9) || (dif==-9) 
				|| this.isCastling(_new)
				)
		}
		this.isCastling = function (_new){
			var old = this.SquareID;
			if(!this.NeverMoved)return false;
			if(old - _new == 2 && (_self.Pieces[old-4].NeverMoved && _self.Pieces[old-4].Type=="Rook" && _self.Pieces[_new].Type=="" && _self.Pieces[_new+1].Type==""  && _self.Pieces[_new-1].Type=="" && !this.isUnderAttack(this.Color) && !_self.Pieces[old-1].isUnderAttack(this.Color) && !_self.Pieces[_new-2].isUnderAttack(this.Color) ) ){ //Queenside Castling
					this.QueenSideCastling(old,_new);
					return true;
			}
			else if(old - _new == -2 && (_self.Pieces[old+3].NeverMoved && _self.Pieces[old+3].Type=="Rook" && _self.Pieces[_new].Type=="" && _self.Pieces[_new-1].Type=="" && !this.isUnderAttack(this.Color) && !_self.Pieces[old+1].isUnderAttack(this.Color) && !_self.Pieces[old+2].isUnderAttack(this.Color) ) ){ // Kingside Castling
				
					this.KingSideCastling(old,_new);
					return true;
			}
			
			return false;
			
		}
		this.KingSideCastling = function(old,_new){
			console.log("Kingside Castling");
			_self.putPiece(_new-1,"Rook",this.Color);
			_self.removePiece(old+3);
			_self.Pieces[_new].NeverMoved = false;
			_self.Pieces[_new-1].NeverMoved = false;
		}
		this.QueenSideCastling = function(old,_new){
			console.log("Queenside Castling");
			_self.putPiece(old-1,"Rook",this.Color);
			_self.removePiece(old-4);
			_self.Pieces[_new].NeverMoved = false;
			_self.Pieces[_new+1].NeverMoved = false;
		}
	}
	function MyChessGamePlay(){
		this.playing = "White"; //who starts the game
		
		this.Black = {
			King:{}
		}
		this.White = {
			King:{}
		}
	}
	function MyChessDOM(){
		_self.mainboard.classList.add("mychess-main");
		makeBoard();
		function makeBoard(){

			var res = "<div class='board-main'>"; 
			for (var i = 0; i < 8; i++) {
				res += '<div class="board-row">';
				for (var j = 0; j < 8; j++) {
					res += '<div class="board-sq"></div>';
				};
				res += '</div>';
			};
			res += '<div>';
			_self.mainboard.innerHTML = res;
			sqColors();
		}
		function sqColors() {
			var sqs = _self.mainboard.getElementsByClassName("board-sq"),rownumber = 0;
			for (var i = 0; i < 64; i++) {
					if(i%8==0)rownumber++;
					if ( ( rownumber%2==0 && i%2==0 ) ||( rownumber%2==1 && i%2==1 ) ) {
						sqs[i].classList.add("dark");
						sqs[i].setAttribute("sqcolor","dark");
					}
					else  {
						sqs[i].classList	.add("light");
						sqs[i].setAttribute("sqcolor","light");
					}
					_self.Pieces.push(
						new MyChessPiece({Element:sqs[i],SquareID:i})
					);
				};
		}
	}
	function MyChessDebug(){
		_self.mainboard.innerHTML += "<div class='board-debug'><ul></ul></div>";
	}
	
	this.init = function(){
		this.mainboard  = document.getElementById(elemid);
		this.DOM = new MyChessDOM();
		this.GamePlay = new MyChessGamePlay();
		
		this.startPosition();
		this.mainboard.addEventListener ("mousedown", OnMouseDown,false);
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
			case 'King' : 
				this.Pieces[sq] = ( new MyChessKing(opts));
				
				this.GamePlay[color].King = this.Pieces[sq];
				
				break;
		}
	}
	this.removePiece =function(sq){
		if(!Number.isInteger(sq)) sq = getRowId(sq);
		this.Pieces[sq]= new MyChessPiece({Element:this.Pieces[sq].Element,SquareID:sq});
		this.Pieces[sq].Element.innerHTML = "";
	}
	this.movePiece = function(old,_new){
		if(!Number.isInteger(old)) old = getRowId(old);
		if(!Number.isInteger(_new)) _new = getRowId(_new);
		//
		this.putPiece(_new,this.Pieces[old].Type,this.Pieces[old].Color);
		this.Pieces[old]= new MyChessPiece({Element:this.Pieces[old].Element,SquareID:old});
		this.Pieces[old].Element.innerHTML = "";
		this.Pieces[_new].NeverMoved = false;
	}
	
	this.moveCompleted = function(e){
		
		var target = e.target,old = parseInt( target.getAttribute("sqid") ),
		_new = (parseInt(e.clientY/50)*8) + (parseInt(e.clientX/50))
		if(old==_new){this.moveCanceled(target);return false;}
		if(_new >=64){this.moveCanceled(target);return false;}
		if(isNaN(old))return false;

		var oldpc = (this.Pieces[_new].Element.getElementsByClassName("board-pcs")[0] );
		if(oldpc != undefined && oldpc.getAttribute("pccolor") == this.GamePlay.playing){
			this.moveCanceled(target);return false;
		} 
		if(target.getAttribute("pccolor")!=this.GamePlay.playing){this.moveCanceled(target);return false;}
		if(e.clientX >400 || e.clientY >400){
			this.moveCanceled(target);return false;
		}
		target.style.left =0+"px";
		target.style.top =0+"px";
		target.style.zIndex =drag.oldZIndex;
		target.setAttribute("sqid", _new);
		this.movePiece(old,_new);
		if(this.GamePlay.playing=="White")this.GamePlay.playing="Black";
		else this.GamePlay.playing="White";
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
			oldZIndex : 900
		}
		_self.mainboard.removeEventListener ("mousemove" , OnMouseMove , false);
    	_self.mainboard.removeEventListener ("mouseup" , OnMouseUp , false);

    	var old =  makeNumber(e.target.getAttribute("sqid")),
		_new = (parseInt(e.clientY/50)*8) + (parseInt(e.clientX/50)),
		_temType = _self.Pieces[_new].Type ;

		 
		if(_self.Pieces[old].Type=="King" ) {
			_self.Pieces[_new].Type = "King";
			if( _self.Pieces[_new].isUnderAttack(_self.Pieces[old].Color)){
				_self.Pieces[_new].Type = _temType;
				_self.moveCanceled(e.target);
				return;
			}
			_self.Pieces[_new].Type = _temType;
		}else{
			if(_self.Pieces[old].isKinginDanger(_new)){
				_self.moveCanceled(e.target);
				return;
			}
		}
    	if(_self.Pieces[old].isLegalMove(_new)){
    		_self.Pieces[old].NeverMoved = false;
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
        	target.style.zIndex = 1000;
        
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