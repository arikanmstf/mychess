function MyChess (elemid,opts) {
	var _self = this;
	_self . elemid = elemid;

	/* child classes */
	MyChess.Piece = function(opts) {
		this.Color = opts && opts.Color ? opts.Color : ""; // String | White,Black
		this.Square = opts && opts.Square ? opts.Square : ""; //Object MyChessSquare
		this.Type =  ""; // String | Pawn , Rook , Knight , Bishop, Queen , King
		this.Symbol = opts && opts.Symbol ? opts.Symbol : ""; // String | N,B,K,R,Q
		this.Element = {innerHTML:""} ; //HTMLDOMObject

		
		this.__construct = function(){
			if (this.Type != "") {
				var e = document.createElement("img");
				e.src = "./img/pcs/"+this.Color+this.Type+".png";
				e.setAttribute("draggable","true");
				e.setAttribute("pccolor",this.Color);
				e.setAttribute("pctype",this.Type);
				e.setAttribute("sqid",this.Square.SquareID);
				e.classList.add("board-pcs");
				e.style.width = parseInt(_self.Width/10)+"px";
				e.style.height = parseInt(_self.Width/10)+"px";
				e.style.marginLeft = parseInt((_self.DOM.BoardSize/8-_self.DOM.BoardSize/10)/2);
				e.style.marginTop = parseInt((_self.DOM.BoardSize/8-_self.DOM.BoardSize/10)/2);
				this.Element = e;
				if(this.Square)this.Square.Element.appendChild(e);
			}
		}
		

		this.PossibleMoves = function(){ // return Array contains MyChess.Square
			console.info("Called abstract function PossibleMoves(); ");
			return [];
		}
		this.isLegalMove = function(){ // return bool | true,false
			console.info("Called abstract function isLegalMove(); ");
			return false;
		}




	};
	MyChess.Piece.Pawn = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Pawn";
		this.__construct();

		this.PossibleMoves = function(){
			
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				res = [];
			
			if( this.Color == "White" ){
				if(_self.GamePlay.Squares[col][row+1].Piece.Type == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][row+1]
					}));
					if (_self.GamePlay.Squares[col][row+2].Piece.Type == "" && this.Square.RowName ==2) {
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col][row+2]
						}));
					};
				}
				if(_self.GamePlay.Squares[col-1][row+1].Piece.Color == "Black"){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col-1][row+1]
					}));
				}
				if(_self.GamePlay.Squares[col+1][row+1].Piece.Color == "Black"){
						res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col+1][row+1]
					}));
				}
			}
			else if (this.Color == "Black"){
				if(_self.GamePlay.Squares[col][row-1].Piece.Type == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][row-1]
					}));
					if (_self.GamePlay.Squares[col][row-2].Piece.Type == "" && this.Square.RowName ==7) {
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col][row-2]
						}));
					};
				}
				if(_self.GamePlay.Squares[col-1][row-1].Piece.Color == "White"){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col-1][row-1]
					}));
				}
				if(_self.GamePlay.Squares[col+1][row-1].Piece.Color == "White"){
						res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col+1][row-1]
					}));
				}
			}
			return res;
		}
		this.isLegalMove = function(_new){
			var moves = this.PossibleMoves();
			for (var i = 0; i < moves.length; i++) {
				if(moves[i].To.ColNum  == _new[0] && moves[i].To.RowName == _new[1]) {
					return moves[i];
				}
			};
			return false;
		}

	}
	MyChess.Piece.Rook = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Rook";
		this.__construct();
	}
	MyChess.Piece.Knight = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Knight";
		this.__construct();
	}
	MyChess.Piece.Bishop = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Bishop";
		this.__construct();
	}
	MyChess.Piece.Queen = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Queen";
		this.__construct();
	}
	MyChess.Piece.King = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "King";
		this.__construct();
	}
	MyChess.Squares = function(){
		this[1] = this.a = [];// Array
		this[2] = this.b = [];// Array
		this[3] = this.c = [];// Array
		this[4] = this.d = [];// Array
		this[5] = this.e = [];// Array
		this[6] = this.f = [];// Array
		this[7] = this.g = [];// Array
		this[8] = this.h = [];// Array

		this.get = function(SquareName){
			return this[SquareName[0]][SquareName[1]];
		}
		
	}
	MyChess.Square = function(opts){
		this.RowName = opts.RowName;// Int   | 1-8
		this.ColName = opts.ColName;// String | a-h
		this.ColNum = opts.ColNum;// Int | 1-8
		this.SquareID = opts.SquareID;// Int | 0-63
		this.Element = opts.Element; // HTMLDOMObject
		this.Piece = new MyChess.Piece(); // Object MyChess.Piece
	}
	MyChess.GamePlay = function(){
		this.Playing = {} ; // Object MyChess.GamePlay.Player
		this.Moves = [] ; // Array contains MyChess.GamePlay.Move
		this.Squares = new MyChess.Squares(); // Array contains MyChess.Square

		/* child classes */
		MyChess.GamePlay.Move = function(opts){
			this.From = opts && opts.From ? opts.From : {} ; // Object MyChess.Square
			this.To =  opts && opts.To ? opts.To : {} ; // Object MyChess.Square
			this.MoveNumber = opts && opts.MoveNumber ? opts.MoveNumber : 0 ; // Int | 1 ...


		}
		MyChess.GamePlay.Player = function(){
			this.Pieces = [] ; // Array contains MyChess.Piece
		}
		/* end of child classes */

		/* public functions*/
		this.StartGame = function(){
			this.addPiece("a8","Rook","Black");
			this.addPiece("b8","Knight","Black");
			this.addPiece("c8","Bishop","Black");
			this.addPiece("d8","Queen","Black");
			this.addPiece("e8","King","Black");
			this.addPiece("f8","Bishop","Black");
			this.addPiece("g8","Knight","Black");
			this.addPiece("h8","Rook","Black");
			for (var i = 8; i < 16; i++) {
				this.addPiece(i,"Pawn","Black");
			};

			this.addPiece(56,"Rook","White");
			this.addPiece(63,"Rook","White");
			this.addPiece(57,"Knight","White");
			this.addPiece(62,"Knight","White");
			this.addPiece(58,"Bishop","White");
			this.addPiece(61,"Bishop","White");
			this.addPiece(59,"Queen","White");
			this.addPiece(60,"King","White");
			for (var i = 48; i < 56; i++) {
				this.addPiece(i,"Pawn","White");
			};
		}
		this.loadFEMString = function(){

		}
		this.addPiece = function(SQ,Type,Color){
			if(Number.isInteger(SQ)) SQ = getSQ(SQ);
			if (SQ.length != 2) {return false;}

			var opts = {
				Color:Color,
				Square:this.Squares[SQ[0]][SQ[1]]
			}
			switch(Type){
				case "Pawn" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Pawn(opts);break;
				case "Rook" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Rook(opts);break;
				case "Knight" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Knight(opts);break;
				case "Bishop" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Bishop(opts);break;
				case "Queen" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Queen(opts);break;
				case "King" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.King(opts);break;
			}
		}
		this.checkMove = function(old,_new){
			var old = getSQ(old),_new = getSQ(_new),
			m = this.Squares[old[0]][old[1]].Piece.isLegalMove(_new);
			if(m){
				this.moveConfirmed(m);
			}else{
				this.moveDenied(old);
			}
		}
		this.moveConfirmed = function(m){
			// HTML
			m.MoveNumber = this.Moves.length;
			this.Moves.push(m);
			m.From.Piece.Element.style.left =0+"px";
			m.From.Piece.Element.style.top =0+"px";
			m.From.Piece.Element.style.zIndex =900;
			m.From.Piece.Element.setAttribute("sqid",m.To.SquareID);
			m.To.Element.appendChild(m.From.Piece.Element);
			
			if( m.To.Piece.Type != ""){
				m.To.Element.removeChild (m.To.Piece.Element);
			}
			//
			m.From.Piece.Square = m.To;
			m.To.Piece = m.From.Piece;
			m.From.Piece = new MyChess.Piece({Type:"",Color:"",Square:m.From});
			console.log(this.Moves);
		}
		this.moveDenied = function(n){
			_self.GamePlay.Squares[n[0]][n[1]].Piece.Element.style.left =0+"px";
			_self.GamePlay.Squares[n[0]][n[1]].Piece.Element.style.top =0+"px";
			_self.GamePlay.Squares[n[0]][n[1]].Piece.Element.style.zIndex =900;
		}

		/* private functions */
		function getSQ(foo){
			var r = 8-parseInt(foo/8),a = (foo%8)+1,n;
			switch(a){
				case 1:n="a";break;
				case 2:n="b";break;
				case 3:n="c";break;
				case 4:n="d";break;
				case 5:n="e";break;
				case 6:n="f";break;
				case 7:n="g";break;
				case 8:n="h";break;
			}
			return [a,r];
		}
		/* end of private functions */
	}
	MyChess.DOM = function(elemid,opts){
		
		MyChess.DOM.Drag = function(element){
			var Element = element,
			drag = {
				element:null,
				startX : 0,
				startY : 0,
				offsetX : 0,
				offsetY : 0
			}
			Element.addEventListener ("mousedown", OnMouseDown,false);

			//
			function OnMouseMove(e){
				Element.addEventListener ("mouseup", OnMouseUp,false);
		    	if (e == null) var e = window.event; 
		    	if(drag.element != null){
		   			drag.element.style.left = (drag.offsetX + e.clientX - drag.startX) + 'px';
		    		drag.element.style.top = (drag.offsetY + e.clientY - drag.startY) + 'px';
		    	}
		    }
			function OnMouseUp(e){
				drag = {
					element:null,
					startX : 0,
					startY : 0,
					offsetX : 0,
					offsetY : 0
				}
				Element.removeEventListener ("mousemove" , OnMouseMove , false);
		    	Element.removeEventListener ("mouseup" , OnMouseUp , false);

		    	var old =  makeNumber(e.target.getAttribute("sqid")),
				_new = (parseInt(e.clientY/parseInt(_self.DOM.BoardSize/8))*8) + (parseInt(e.clientX/parseInt(_self.DOM.BoardSize/8)));
				_self.GamePlay.checkMove(old,_new);
			}

			function OnMouseDown(e){
				Element.addEventListener ("mousemove", OnMouseMove,false);
		    	if (e == null) e = window.event; 
		    	var target = e.target != null ? e.target : e.srcElement;
		    	if(target==null)return false;
		    	if ((e.button == 1 && window.event != null || 
		        e.button == 0) && target.className == 'board-pcs'){
		        	drag.startX = e.clientX;
		        	drag.startY = e.clientY;
		        
			        drag.offsetX = makeNumber(target.style.left);
		    	    drag.offsetY = makeNumber(target.style.top);
		        
		        	target.style.zIndex = 1000;
		        
		        	drag.element = target;
		        	document.addEventListener("onmousemove" , OnMouseMove,false);
		        	document.onselectstart = function () { return false; };
		        	target.ondragstart = function() { return false; };
		        	return false;
		    	}
			}
			function makeNumber(v){
		    	var n = parseInt(v);
				return n == null || isNaN(n) ? 0 : n;
			}
		}

		/* public functions */
		this.MakeBoard = function(){
			var m = document.createElement("div");
			m.classList.add("board-main");
			for (var i = 0; i < 8; i++) {
				
				var row = document.createElement("div");
				row.classList.add("board-row");
				row.style.width = parseInt(this.BoardSize)+"px";
				row.style.height = parseInt(this.BoardSize/8)+"px";
				
				for (var j = 0; j < 8; j++) {
					var colname;
					switch(j){
						case 0: colname  = "a"; break;
						case 1: colname  = "b"; break;
						case 2: colname  = "c"; break;
						case 3: colname  = "d"; break;
						case 4: colname  = "e"; break;
						case 5: colname  = "f"; break;
						case 6: colname  = "g"; break;
						case 7: colname  = "h"; break;
					}
					var d = document.createElement("div") ;
					d.classList.add("board-sq");
					d.style.width =parseInt(this.BoardSize/8)+"px";
					d.style.height =parseInt(this.BoardSize/8)+"px";
					
					if( ( (i%2==0) && (j%2==0) ) || ((i%2==1) && (j%2==1)) ){
						d.classList.add("light");
						d.setAttribute("sqcolor","light");
					}
					else{
						d.classList.add("dark");
						d.setAttribute("sqcolor","dark");
					}
					_self.GamePlay.Squares[j+1][8-i] = 
					(new MyChess.Square({
						Element : d,
						SquareID : (i*8)+j ,
						ColName : colname,
						RowName : 8-i,
						ColNum  : j+1
					}));
					row.appendChild(d);
				};
				m.appendChild(row);
			};
			this.Element.appendChild (m);
			this.BoardMain = m;
			/*res += '<div class="board-promote" style="width:'+parseInt(this.BoardSize/2)+'px;height:'+parseInt(this.BoardSize/2)+'px;left:'+parseInt(this.BoardSize/4)+'px;top:'+parseInt(this.BoardSize/4)+'px;display:none;"><div class="promote-sq light" style="width:'+parseInt(this.BoardSize/4)+'px;height:'+parseInt(this.BoardSize/4)+'px"></div><div class="promote-sq dark" style="width:'+parseInt(this.BoardSize/4)+'px;height:'+parseInt(this.BoardSize/4)+'px"></div><div class="promote-sq dark" style="width:'+parseInt(this.BoardSize/4)+'px;height:'+parseInt(this.BoardSize/4)+'px"></div><div class="promote-sq light" style="width:'+parseInt(this.BoardSize/4)+'px;height:'+parseInt(this.BoardSize/4)+'px"></div></div>';
			res += '</div>';
			res += '<div class="message-main" style="display:none;"><div class="message-cover"</div></div>';*/
			
		}

		/* end of public functions */

		/* private functions */
		
		/* end of private functions*/

		/* construct*/
		this.Element = document.getElementById(elemid); //HTMLDOMObject
		this.DefaultSize = 400; // Integer
		this.BoardSize = opts && opts.BoardSize ? opts.BoardSize : this.DefaultSize; // Integer
		this.Element.classList.add("mychess-main");
		this.MakeBoard();
		this.Drag = new MyChess.DOM.Drag(this.BoardMain);


	}
	MyChess.Log = function(){

	}
	/* end of child classes */

	/* public functions */
	this.init = function(){
		this.GamePlay = new MyChess.GamePlay();
		this.DOM = new MyChess.DOM(_self.elemid);
		this.GamePlay.StartGame();
	}

	/* end of public functions */

	/* construct */

	this.init();
}