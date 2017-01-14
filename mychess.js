function myChess(elemid){
	var _self = this;
	this.elemid =elemid;
	this.playing = "White";
	this.downPlayer = "White";
	var drag = {
		element:null,
		startX : 0,
		startY : 0,
		offsetX : 0,
		offsetY : 0,
		oldZIndex : 0
	}
	
	this.init = function(){
		this.mainboard  = document.getElementById(elemid),
		rownumber = 0;
		this.sqs = this.mainboard.getElementsByClassName("board-sq");
		this.sqColors();
		this.startPosition();
		this.mainboard.addEventListener ("mousedown", OnMouseDown,false);
	}
	this.sqColors = function () {
		
		for (var i = 0; i < 64; i++) {
			if(i%8==0)rownumber++;
			if ( ( rownumber%2==0 && i%2==0 ) ||( rownumber%2==1 && i%2==1 ) )  this.sqs[i].classList.add("dark");
			else  this.sqs[i].classList	.add("light");
		};
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
		this.putPiece("a2","Knight","White");
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
		if(!Number.isInteger(sq)) sq = this.getRowId(sq);
		this.sqs[sq].innerHTML = "<img draggable='true' src='./img/pcs/"+color+type+".png' class='board-pcs' pccolor="+color+" sqid="+sq+" pctype="+type+" />";
	}
	this.removePiece =function(sq){
		if(!Number.isInteger(sq)) sq = this.getRowId(sq);
		this.sqs[sq].innerHTML = "";
	}
	this.movePiece = function(old,_new){
		if(!Number.isInteger(old)) old = this.getRowId(old);
		if(!Number.isInteger(_new)) _new = this.getRowId(_new);
		this.sqs[_new].innerHTML =this.sqs[old].innerHTML ;
		this.sqs[old].innerHTML = "";
	}
	this.getRowId = function(foo){
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
	this.isLegalMove = function(e){
		var target = e.target,
		type = target.getAttribute("pctype"),
		sq =  makeNumber(target.getAttribute("sqid")),
		color = target.getAttribute("pccolor"),
		_new = (parseInt(e.clientY/50)*8) + (parseInt(e.clientX/50)),
		possible = [],
		result = false;
		function isLegalPawnMove(){
			
			console.log(sq,_new)
			var r= 
			( (_self.downPlayer=="White" && color=="Black" ) || (_self.downPlayer=="Black" && color=="White") ) ? 
				( ( _new == sq+8 || ((sq>=8 && sq<16 && _self.sqs[_new-8].innerHTML=="") ? (_new == sq+16):false )) && _new <64 && _self.sqs[_new].innerHTML=="" ) || ( (_new==sq+7 || _new==sq+9) && _new<64 && _self.sqs[_new].innerHTML!="") ||  isEnPassant(): 
				( ( _new == sq-8 || ((sq>=48 && sq<56) ? (_new == sq-16  && _self.sqs[_new+8].innerHTML==""):false )) && _new <64 && _self.sqs[_new].innerHTML=="") || ( (_new==sq-7 || _new==sq-9) && _new<64 && _self.sqs[_new].innerHTML!="") || isEnPassant();
			
			return r;
		}
		function isLegalRookMove(){
			var r =true;
			console.log(sq,_new)
			if( (sq - _new)% 8 ==0 ){
				if(sq>_new){
					for (var i=sq-8; i > _new; i-=8) {
						if(_self.sqs[i].innerHTML!="") {
							r=false;
							break;
						}
					}
				}
				else if(sq<_new){
					for (var i=sq+8; i < _new; i+=8) {
						if(_self.sqs[i].innerHTML!="") {
							r=false;
							break;
						}
					}
				}
				
			}
			else if( (parseInt(sq/8)==parseInt(_new/8)) ){
				if(sq>_new){
					for (var i=sq-1; i > _new; i--) {
						if(_self.sqs[i].innerHTML!="") {
							r=false;
							break;
						}
					};
				}
				else if(sq<_new){
					for (var i=sq+1; i < _new; i++) {
						if(_self.sqs[i].innerHTML!="") {
							r=false;
							break;
						}
					}
				}
			}
			else if(isCastling()){
				return true;
			}
			return r;
			
		}
		function isEnPassant(){
			return false;
		}
		function isCastling(){
			return false;
		}
		switch (type){
			case "Pawn" : result = isLegalPawnMove();break;
			case "Rook" : result = isLegalRookMove();break;
			default : return false;
		}
		return result;
	}
	this.moveCompleted = function(e){
		
		var target = e.target,old = parseInt( target.getAttribute("sqid") ),
		_new = (parseInt(e.clientY/50)*8) + (parseInt(e.clientX/50))
		if(old==_new){this.moveCanceled(target);return false;}
		if(isNaN(old))return false;

		var oldpc = (this.sqs[_new].getElementsByClassName("board-pcs")[0] );
		if(oldpc != undefined && oldpc.getAttribute("pccolor") == this.playing){
			this.moveCanceled(target);return false;
		} 
		if(target.getAttribute("pccolor")!=this.playing){this.moveCanceled(target);return false;}
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
    	if(_self.isLegalMove(e)){
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
	this.init();
	return this;
}
var mc = new myChess("mychess-board");