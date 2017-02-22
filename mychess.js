Array.prototype.last = function(){ return this.length >0 ? this[this.length-1] : false;}
function MyChess (elemid,opts) {
	var _self = this;
	_self . elemid = elemid; 
	/* child classes */
	MyChess.Piece = function(opts) {
		this.Color = opts && opts.Color ? opts.Color : ""; // String | White,Black
		this.Square = opts && opts.Square ? opts.Square : ""; //Object MyChessSquare
		this.Index = opts && (opts.Index || opts.Index == "0" )? opts.Index : undefined; //Int
		this.Type =  ""; // String | Pawn , Rook , Knight , Bishop, Queen , King
		this.Symbol = opts && opts.Symbol ? opts.Symbol : ""; // String | N,B,K,R,Q
		this.Element = {innerHTML:""} ; //HTMLDOMObject
		this.NeverMoved = true; // Boolean
		this.Alive = true;

		
		this.__construct = function(){
			if (this.Type != "") {
				var e = document.createElement("img");
				e.src = "./img/pcs/"+this.Color+this.Type+".png";
				e.setAttribute("draggable","true");
				e.setAttribute("pccolor",this.Color);
				e.setAttribute("pctype",this.Type);
				e.setAttribute("sqid",this.Square.SquareID);
				e.classList.add("board-pcs");
				e.style.width = parseInt(_self.DOM.BoardSize/10)+"px";
				e.style.height = parseInt(_self.DOM.BoardSize/10)+"px";
				e.style.marginLeft = parseInt((_self.DOM.BoardSize/8-_self.DOM.BoardSize/10)/2)+"px";
				e.style.marginTop = parseInt((_self.DOM.BoardSize/8-_self.DOM.BoardSize/10)/2)+"px";
				this.Element = e;
				var pcs = this.Square.Element.getElementsByClassName('board-pcs');
				for (var i = 0; i < pcs.length; i++) {
					pcs[i].parentNode.removeChild(pcs[i]);
				};
				if(this.Square)this.Square.Element.appendChild(e);
			}
		}

		this.isInDanger = function(){
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				Color = this.Color, O ;
			if(this.Color == "White"){
				O = "Black";
			}else{
				O = "White";
			}

			var Pieces = _self.GamePlay.Players[O].Pieces;

			for (var i = 0; i < Pieces.length; i++) {
				if(!Pieces[i].Alive)continue;
				var m = Pieces[i].PossibleMoves();
				for (var j = 0; j < m.length; j++) {
					if(m[j].To.ColNum  == col && m[j].To.RowName == row){
						return true;
					}
				};
			};
			return false;

		}
		this.KingSafeFilter = function(res){
			var King  = _self.GamePlay.Players[this.Color].King,
			moves = [],_tempToPiece;

			for (var i = 0; i < res.length; i++) {

				_tempToPiece = res[i].To.Piece ;
				_tempSta = _tempToPiece.Alive;
				_tempToPiece.Alive = false;
				res[i].From.Piece.Square = res[i].To;
				res[i].To.Piece = res[i].From.Piece;
				res[i].From.Piece = new MyChess.Piece({Type:"",Color:"",Square:res[i].From});
				if(King.isInDanger()){
					_tempToPiece.Alive = _tempSta;
					res[i].From.Piece = res[i].To.Piece;
					res[i].To.Piece = _tempToPiece;
					res[i].From.Piece.Square = res[i].From; 
				}else{
					_tempToPiece.Alive = _tempSta;
					res[i].From.Piece = res[i].To.Piece;
					res[i].To.Piece = _tempToPiece;
					res[i].From.Piece.Square = res[i].From;
					moves.push(res[i]);
				}

			};
			return moves;
		}
		this.PossibleMoves = function(){ // return Array contains MyChess.Square
			console.info("Called abstract function PossibleMoves(); ");
			return [];
		}
		this.isLegalMove = function(_new){
			var moves = this.PossibleMoves();
			moves = this.KingSafeFilter(moves);
			//console.log(moves);
			for (var i = 0; i < moves.length; i++) {
				if(moves[i].To.ColNum  == _new[0] && moves[i].To.RowName == _new[1]) {
					return moves[i];
				}
			};
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
				if( row <8 && _self.GamePlay.Squares[col][row+1].Piece.Type == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][row+1],
						Special : (row == 7) ? "WhitePromote" : false
					}));
					if (row < 7 && _self.GamePlay.Squares[col][row+2].Piece.Type == "" && this.Square.RowName ==2) {
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col][row+2]
						}));
					};
				}
				if( col > 1  && row < 8 && _self.GamePlay.Squares[col-1][row+1].Piece.Color == "Black"){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col-1][row+1],
						Special : (row == 7) ? "WhitePromote" : false
					}));
				}
				if(col < 8 && row < 8 && _self.GamePlay.Squares[col+1][row+1].Piece.Color == "Black"){
						res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col+1][row+1],
						Special : (row == 7) ? "WhitePromote" : false
					}));
				}
			}
			else if (this.Color == "Black"){
				if(row > 1 && _self.GamePlay.Squares[col][row-1].Piece.Type == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][row-1],
						Special : (row == 2) ? "BlackPromote" : false
					}));
					if (row > 2 && _self.GamePlay.Squares[col][row-2].Piece.Type == "" && this.Square.RowName ==7) {
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col][row-2]
						}));
					};
				}
				if(col > 1 && row > 1 && _self.GamePlay.Squares[col-1][row-1].Piece.Color == "White"){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col-1][row-1],
						Special : (row == 2) ? "BlackPromote" : false
					}));
				}
				if( col < 8 && row > 1 && _self.GamePlay.Squares[col+1][row-1].Piece.Color == "White"){
						res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col+1][row-1],
						Special : (row == 2) ? "BlackPromote" : false
					}));
				}
			}
			var ep = this.EnPassantMoves();
			return res.concat(ep);
		}
		this.EnPassantMoves = function(){
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				res = [],
				lastMove = _self.GamePlay.Moves.last();
			if(this.Color == "White"){
				if(row == 5){
					if(lastMove && lastMove.To.Piece.Color == "Black" && lastMove.To.Piece.Type == "Pawn"){
						if(lastMove.To.RowName == row && lastMove.From.RowName == 7 && (lastMove.To.ColNum == col-1 || lastMove.To.ColNum == col+1 ) ){
							res.push( new MyChess.GamePlay.Move({
								From : this.Square,
								To : _self.GamePlay.Squares[lastMove.To.ColNum][row+1],
								Special: "WhiteEnPassant"
							}));
						}
					}
				}
			}else if(this.Color == "Black"){
				if(row==4){
					if(lastMove && lastMove.To.Piece.Color == "White" && lastMove.To.Piece.Type == "Pawn"){
						if(lastMove.To.RowName == row && lastMove.From.RowName == 2 && (lastMove.To.ColNum == col-1 || lastMove.To.ColNum == col+1 ) ){
							res.push( new MyChess.GamePlay.Move({
								From : this.Square,
								To : _self.GamePlay.Squares[lastMove.To.ColNum][row-1],
								Special:"BlackEnPassant"
							}));
						}
					}
				}
			}
			return res;
		}
		

	}
	MyChess.Piece.Rook = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Rook";
		this.__construct();
		this.PossibleMoves = function(){
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				res = [];
			for (var i = row+1; i <= 8; i++) {
				if(_self.GamePlay.Squares[col][i].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
				}
				else if(_self.GamePlay.Squares[col][i].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
					break;
				}else{
					break;
				}
			}

			for (var i = row-1; i >= 1; i--) {
				if(_self.GamePlay.Squares[col][i].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
				}
				else if(_self.GamePlay.Squares[col][i].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
					break;
				}else{
					break;
				}
			}

			for (var i = col+1; i <= 8; i++) {
				if(_self.GamePlay.Squares[i][row].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
				}
				else if(_self.GamePlay.Squares[i][row].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col-1; i >= 1; i--) {
				if(_self.GamePlay.Squares[i][row].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
				}
				else if(_self.GamePlay.Squares[i][row].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
					break;
				}else{
					break;
				}
			}
			return res;
		}
	}
	MyChess.Piece.Knight = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Knight";
		this.__construct();
		this.PossibleMoves = function () {
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				res = [];

			if(col<8){

				if(col < 7){
					if(row > 1 && _self.GamePlay.Squares[col+2][row-1].Piece.Color != this.Color ){
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col+2][row-1]
						}));
					}
					if(row < 8 && _self.GamePlay.Squares[col+2][row+1].Piece.Color != this.Color){
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col+2][row+1]
						}));
					}
				}
				if(row <7 && _self.GamePlay.Squares[col+1][row+2].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
								From : this.Square,
								To : _self.GamePlay.Squares[col+1][row+2]
							}));
				}
				if(row > 2 && _self.GamePlay.Squares[col+1][row-2].Piece.Color != this.Color){

					res.push( new MyChess.GamePlay.Move({
								From : this.Square,
								To : _self.GamePlay.Squares[col+1][row-2]
							}));
				}
			}
			if(col > 1){


				if(row > 2 && _self.GamePlay.Squares[col-1][row-2].Piece.Color != this.Color){

					res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col-1][row-2]
						}));
				}
				if(row < 7 && _self.GamePlay.Squares[col-1][row+2].Piece.Color != this.Color){

					res.push( new MyChess.GamePlay.Move({
								From : this.Square,
								To : _self.GamePlay.Squares[col-1][row+2]
							}));
				}
				if(col > 2){

					if(row >1 && _self.GamePlay.Squares[col-2][row-1].Piece.Color != this.Color){

						res.push( new MyChess.GamePlay.Move({
									From : this.Square,
									To : _self.GamePlay.Squares[col-2][row-1]
								}));
					}
					if(row <8 && _self.GamePlay.Squares[col-2][row+1].Piece.Color != this.Color){

						res.push( new MyChess.GamePlay.Move({
									From : this.Square,
									To : _self.GamePlay.Squares[col-2][row+1]
								}));
					}
				}
			}
			return res;
		}
	}
	MyChess.Piece.Bishop = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "Bishop";
		this.__construct();
		this.PossibleMoves = function(){
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				res = [];
			for (var i = col-1,j=row-1; i > 0 && j >0; i--,j--) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col+1,j=row+1; i <= 8 && j <= 8; i++,j++) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col+1,j=row-1; i <= 8 && j > 0; i++,j--) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col-1,j=row+1; i > 0 && j <= 8; i--,j++) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}
			return res;
		}
	}
	MyChess.Piece.Queen = function(opts){

		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece

		this.PossibleMoves = function(){
			//bishop
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				res = [];
			for (var i = col-1,j=row-1; i > 0 && j >0; i--,j--) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col+1,j=row+1; i <= 8 && j <= 8; i++,j++) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col+1,j=row-1; i <= 8 && j > 0; i++,j--) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col-1,j=row+1; i > 0 && j <= 8; i--,j++) {
				if(_self.GamePlay.Squares[i][j].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
				}
				else if(_self.GamePlay.Squares[i][j].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][j]
					}));
					break;
				}else{
					break;
				}
			}

			//rook
			for (var i = row+1; i <= 8; i++) {
				if(_self.GamePlay.Squares[col][i].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
				}
				else if(_self.GamePlay.Squares[col][i].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
					break;
				}else{
					break;
				}
			}

			for (var i = row-1; i >= 1; i--) {
				if(_self.GamePlay.Squares[col][i].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
				}
				else if(_self.GamePlay.Squares[col][i].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][i]
					}));
					break;
				}else{
					break;
				}
			}

			for (var i = col+1; i <= 8; i++) {
				if(_self.GamePlay.Squares[i][row].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
				}
				else if(_self.GamePlay.Squares[i][row].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
					break;
				}else{
					break;
				}
			}
			for (var i = col-1; i >= 1; i--) {
				if(_self.GamePlay.Squares[i][row].Piece.Color == ""){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
				}
				else if(_self.GamePlay.Squares[i][row].Piece.Color !=this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[i][row]
					}));
					break;
				}else{
					break;
				}
			}
			return res;
		}

		this.Type = "Queen";
		this.__construct();
	}
	MyChess.Piece.King = function(opts){
		MyChess.Piece.apply(this,arguments); // extends MyChess.Piece
		this.Type = "King";
		this.PossibleMoves = function(){
			var col = this.Square.ColNum ,
				row = this.Square.RowName, 
				SquareID = this.Square.SquareID,
				res = [];
			if(col<8){
				if(_self.GamePlay.Squares[col+1][row].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col+1][row]
					}));
				}
				if(row>1 && _self.GamePlay.Squares[col+1][row-1].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col+1][row-1]
					}));
				}
				if(row<8 && _self.GamePlay.Squares[col+1][row+1].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col+1][row+1]
					}));
				}
			}
			if(col>1){
				if(_self.GamePlay.Squares[col-1][row].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[col-1][row]
						}));
				}
				if(row>1 && _self.GamePlay.Squares[col-1][row-1].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col-1][row-1]
					}));
				}
				if(row<8 && _self.GamePlay.Squares[col-1][row+1].Piece.Color != this.Color){
					res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col-1][row+1]
					}));
				}
			}
			if(row<8 && _self.GamePlay.Squares[col][row+1].Piece.Color != this.Color){
				res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][row+1]
					}));
			}
			if(row>1 && _self.GamePlay.Squares[col][row-1].Piece.Color != this.Color){
				res.push( new MyChess.GamePlay.Move({
						From : this.Square,
						To : _self.GamePlay.Squares[col][row-1]
					}));
			}
			var cast = this.CastleMoves();
			return  res.concat(cast);
		}
		this.CastleMoves = function(){
			var res = [];
			if(this.NeverMoved){
				if(this.Color == "White"){
					
					//QueenSide
					if(_self.GamePlay.Squares[1][1].Piece.Type == "Rook" && _self.GamePlay.Squares[1][1].Piece.Color == "White" && _self.GamePlay.Squares[1][1].Piece.NeverMoved && _self.GamePlay.Squares[2][1].Piece.Type=="" && _self.GamePlay.Squares[3][1].Piece.Type=="" && _self.GamePlay.Squares[4][1].Piece.Type=="" ){
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[3][1],
							Special:"QueenSideWhiteCastling"
						}));
					}
					//KingSide
					if(_self.GamePlay.Squares[8][1].Piece.Type == "Rook" && _self.GamePlay.Squares[8][1].Piece.Color == "White" && _self.GamePlay.Squares[8][1].Piece.NeverMoved && _self.GamePlay.Squares[7][1].Piece.Type=="" && _self.GamePlay.Squares[6][1].Piece.Type==""){
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[7][1],
							Special:"KingSideWhiteCastling"
						}));
					}
				
				}
				else if(this.Color == "Black"){
					
					//QueenSide
					if(_self.GamePlay.Squares[1][8].Piece.Type == "Rook" && _self.GamePlay.Squares[1][8].Piece.Color == "Black" && _self.GamePlay.Squares[1][8].Piece.NeverMoved && _self.GamePlay.Squares[2][8].Piece.Type=="" && _self.GamePlay.Squares[3][8].Piece.Type=="" && _self.GamePlay.Squares[4][8].Piece.Type==""){
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[3][8],
							Special:"QueenSideBlackCastling"
						}));
					}
					//KingSide
					if(_self.GamePlay.Squares[8][8].Piece.Type == "Rook" && _self.GamePlay.Squares[8][8].Piece.Color == "Black" && _self.GamePlay.Squares[8][8].Piece.NeverMoved && _self.GamePlay.Squares[7][8].Piece.Type=="" && _self.GamePlay.Squares[6][8].Piece.Type==""){
						res.push( new MyChess.GamePlay.Move({
							From : this.Square,
							To : _self.GamePlay.Squares[7][8],
							Special:"KingSideBlackCastling"
						}));
					}
				
				}

			}

			return res;
		}

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
		

		/* child classes */
		MyChess.GamePlay.Move = function(opts){
			this.From = opts && opts.From ? opts.From : {} ; // Object MyChess.Square
			this.To =  opts && opts.To ? opts.To : {} ; // Object MyChess.Square
			this.Special = opts && opts.Special ? opts.Special : false;
			this.MoveNumber = opts && opts.MoveNumber ? opts.MoveNumber : 0 ; // Int | 1 ...


		}
		MyChess.GamePlay.Player = function(color){
			this.Color  = color ; // String | White,Black
			this.Pieces = [] ; // Array contains MyChess.Piece
			this.King = {}; // Object MyChess.Piece.King
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

			var index = this.Players[Color].Pieces.length,
			opts = {
				Color:Color,
				Square:this.Squares[SQ[0]][SQ[1]],
				Index : index
			}
			switch(Type){
				case "Pawn" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Pawn(opts);break;
				case "Rook" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Rook(opts);break;
				case "Knight" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Knight(opts);break;
				case "Bishop" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Bishop(opts);break;
				case "Queen" : this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.Queen(opts);break;
				case "King" : 
					this.Squares[SQ[0]][SQ[1]].Piece = new MyChess.Piece.King(opts);
					this.Players[opts.Color].King = this.Squares[SQ[0]][SQ[1]].Piece
					break;
			}
			this.Players[opts.Color].Pieces.push(this.Squares[SQ[0]][SQ[1]].Piece);

		}
		this.checkMove = function(old,_new){

			var old = getSQ(old),_new = getSQ(_new),m;

			if(this.Squares[old[0]][old[1]].Piece.Color != this.Playing && this.Playing != "Both"){
				this.moveDenied(old);
				return false;
			}

			if(this.Squares[old[0]][old[1]].Piece.Color != this.WhoIsNext){
				this.moveDenied(old);
				return false;
			}

			m = this.Squares[old[0]][old[1]].Piece.isLegalMove(_new);
			if(m){
				this.moveConfirmed(m);
			}else{
				this.moveDenied(old);
			}
		}
		this.ShowPawnPromote = function(color){

			var sqs = _self.DOM.Element.ModalPromote.getElementsByClassName("promote-sq "),
			types = ["Queen","Rook","Bishop","Knight"];

			for (var i = 0; i < types.length; i++) {
				var q = document.createElement("img");
				q.src = "./img/pcs/"+color+types[i]+".png";
				q.setAttribute("pctype",types[i]);
				q.classList.add("board-pcs");
				q.style.width = parseInt(_self.DOM.BoardSize/8)+"px";
				q.style.height = parseInt(_self.DOM.BoardSize/8)+"px";
				q.style.marginLeft = parseInt(_self.DOM.BoardSize/16)+"px";
				q.style.marginTop = parseInt(_self.DOM.BoardSize/16)+"px";
				sqs[i].appendChild(q);
			};

			_self.DOM.Element.ModalPromote.style.display = "block";
		}

		this.moveConfirmed = function(m){
			// HTML
			this.Moves.push(m);
			m.MoveNumber = this.Moves.length;
			if(this.WhoIsNext == "White")this.WhoIsNext = "Black";
			else this.WhoIsNext = "White";

			switch (m.Special){

				case 'KingSideBlackCastling' :
						this.Squares[8][8].Piece.Element.setAttribute("sqid",5);
						this.Squares[6][8].Element.appendChild(this.Squares[8][8].Piece.Element);

						this.Squares[8][8].Piece.Square = this.Squares[6][8];
						this.Squares[6][8].Piece = this.Squares[8][8].Piece;
						this.Squares[8][8].Piece = new MyChess.Piece({Type:"",Color:"",Square:7});
					break;

				case 'KingSideWhiteCastling' :
						this.Squares[8][1].Piece.Element.setAttribute("sqid",61);
						this.Squares[6][1].Element.appendChild(this.Squares[8][1].Piece.Element);

						this.Squares[8][1].Piece.Square = this.Squares[6][1];
						this.Squares[6][1].Piece = this.Squares[8][1].Piece;
						this.Squares[8][1].Piece = new MyChess.Piece({Type:"",Color:"",Square:63});
					break;

				case 'QueenSideBlackCastling' :
						this.Squares[1][8].Piece.Element.setAttribute("sqid",3);
						this.Squares[4][8].Element.appendChild(this.Squares[1][8].Piece.Element);

						this.Squares[1][8].Piece.Square = this.Squares[4][8];
						this.Squares[4][8].Piece = this.Squares[1][8].Piece;
						this.Squares[1][8].Piece = new MyChess.Piece({Type:"",Color:"",Square:0});
					break;

				case 'QueenSideWhiteCastling' :
						this.Squares[1][1].Piece.Element.setAttribute("sqid",59);
						this.Squares[4][1].Element.appendChild(this.Squares[1][1].Piece.Element);

						this.Squares[1][1].Piece.Square = this.Squares[4][1];
						this.Squares[4][1].Piece = this.Squares[1][1].Piece;
						this.Squares[1][1].Piece = new MyChess.Piece({Type:"",Color:"",Square:56});
					break;

				case 'WhiteEnPassant' :
						this.Squares[m.To.ColNum][m.To.RowName-1].Element.removeChild (this.Squares[m.To.ColNum][m.To.RowName-1].Piece.Element);
						this.Squares[m.To.ColNum][m.To.RowName-1].Piece.Alive = false;
						this.Squares[m.To.ColNum][m.To.RowName-1].Piece = new MyChess.Piece;
				case 'BlackEnPassant' :
						//this.Squares[m.To.ColNum][m.To.RowName+1].Element.removeChild (this.Squares[m.To.ColNum][m.To.RowName+1].Piece.Element);
						this.Squares[m.To.ColNum][m.To.RowName+1].Piece.Alive = false;
						this.Squares[m.To.ColNum][m.To.RowName+1].Piece = new MyChess.Piece({Type:"",Color:"",Square:m.To.SquareID-8});
					break;
				case 'WhitePromote' :
						_self.tempPawn = m.From.Piece;
						console.log(_self.tempPawn)
						this.ShowPawnPromote("White");
					break;
				case 'BlackPromote' :
						_self.tempPawn = m.From.Piece; 
						this.ShowPawnPromote("Black");
					break;

			}

			m.From.Piece.Element.style.left =0+"px";
			m.From.Piece.Element.style.top =0+"px";
			m.From.Piece.Element.style.zIndex =900;
			m.From.Piece.Element.setAttribute("sqid",m.To.SquareID);
			m.To.Element.appendChild(m.From.Piece.Element);
			
			if( m.To.Piece.Type != ""){
				m.To.Element.removeChild (m.To.Piece.Element);
			}
			//
			m.To.Piece.Alive = false;
			m.From.Piece.NeverMoved = false;
			m.From.Piece.Square = m.To;
			m.To.Piece = m.From.Piece;
			m.From.Piece = new MyChess.Piece({Type:"",Color:"",Square:m.From});
			//console.log(this.Moves);
		}
		this.moveDenied = function(n){
			_self.GamePlay.Squares[n[0]][n[1]].Piece.Element.style.left =0+"px";
			_self.GamePlay.Squares[n[0]][n[1]].Piece.Element.style.top =0+"px";
			_self.GamePlay.Squares[n[0]][n[1]].Piece.Element.style.zIndex =900;
		}

		/* private functions */
		function getSQ(foo){
			var r = 8-parseInt(foo/8),a = (foo%8)+1,n;
			/*
			switch(a){
				case 1:n="a";break;
				case 2:n="b";break;
				case 3:n="c";break;
				case 4:n="d";break;
				case 5:n="e";break;
				case 6:n="f";break;
				case 7:n="g";break;
				case 8:n="h";break;
			}*/
			return [a,r];
		}
		/* end of private functions */

		//construct
		this.Players = {
			White : new MyChess.GamePlay.Player("White"),
			Black : new MyChess.GamePlay.Player("Black")

		} ;

		this.Moves = [] ; // Array contains MyChess.GamePlay.Move
		this.Squares = new MyChess.Squares(); // Array contains MyChess.Square
		this.Playing =  (opts && typeof opts.Playing != "undefined" ) ? opts.Playing : "White";
		this.WhoIsNext =  (opts && typeof opts.WhoIsNext != "undefined" ) ? opts.WhoIsNext : "White";
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
				if(_self.DOM.Click && !_self.DOM.Click.first){
					return false
				}
				Element.addEventListener ("mouseup", OnMouseUp,false);
		    	if (e == null) var e = window.event; 
		    	if(drag.element != null){
		   			drag.element.style.left = (drag.offsetX + e.clientX - drag.startX) + 'px';
		    		drag.element.style.top = (drag.offsetY + e.clientY - drag.startY) + 'px';
		    	}
		    }
			function OnMouseUp(e){
				if(_self.DOM.Click && !_self.DOM.Click.first){
					return false
				}
				drag = {
					element:null,
					startX : 0,
					startY : 0,
					offsetX : 0,
					offsetY : 0
				}
				Element.removeEventListener ("mousemove" , OnMouseMove , false);
		    	Element.removeEventListener ("mouseup" , OnMouseUp , false);
		    	if(e.target.getAttribute("sqid") != null){

		    		var old =  makeNumber(e.target.getAttribute("sqid")),
					_new = (parseInt(e.pageY/parseInt(_self.DOM.BoardSize/8))*8) + (parseInt(e.pageX	/parseInt(_self.DOM.BoardSize/8)));
					_self.GamePlay.checkMove(old,_new);
		    	}
				

			}

			function OnMouseDown(e){
				if(_self.DOM.Click && !_self.DOM.Click.first){
					return false
				}
				Element.addEventListener ("mousemove", OnMouseMove,false);
				Element.addEventListener ("mouseup", OnMouseUp,false);
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
		MyChess.DOM.ClickPawnPromote = function(element){
			var Element = element,
			_s = this;
			Element.addEventListener("click",OnClick,false);

			function OnClick(e){
				var pawn = _self.tempPawn, piece,
				opts = {
					Color:pawn.Color,
					Square:pawn.Square,
					Index : pawn.Index
				},
				Type = (e.target.getAttribute("pctype"));

				switch(Type){
					case "Rook" : piece = new MyChess.Piece.Rook(opts);break;
					case "Knight" : piece = new MyChess.Piece.Knight(opts);break;
					case "Bishop" : piece = new MyChess.Piece.Bishop(opts);break;
					case "Queen" :  piece = new MyChess.Piece.Queen(opts);break;
					default : return;
				}

				piece.NeverMoved = false; // Boolean
				piece.Alive = true;
				_self.GamePlay.Squares[pawn.Square.ColNum][pawn.Square.RowName].Piece = 
				_self.GamePlay.Players[pawn.Color].Pieces[pawn.Index]  = piece;
				_self.tempPawn = null;
				console.log(piece)
				_self.DOM.Element.ModalPromote.style.display = "none";
			}
		}

		MyChess.DOM.Click = function (element) {
			var Element = element,
			old,_new,p = [],_s = this;
			this.first = true;

			Element.addEventListener ("click", OnClick,false);

			function OnClick(e){
				
				function start(){
					Element = e.target;
					old =  makeNumber(e.target.getAttribute("sqid"));
					
					_self.DOM.Squares[old].Element.classList.add("selected");
					if(_self.DOM.ShowPossibleMoves){

						p = _self.DOM.Squares[old].Piece.PossibleMoves();
						p = _self.DOM.Squares[old].Piece.KingSafeFilter(p);
						for (var i = 0; i < p.length; i++) {
							p[i].To.Element.classList.add("possible")
						}
					}
				}
				function end(){
					_new = (parseInt(e.pageY/parseInt(_self.DOM.BoardSize/8))*8) + (parseInt(e.pageX/parseInt(_self.DOM.BoardSize/8)));
					_self.DOM.Squares[old].Element.classList.remove("selected");					
					if(_self.DOM.ShowPossibleMoves){
						for (var i = 0; i < p.length; i++) {
							p[i].To.Element.classList.remove("possible")
						}
					}
				}
				if(_s.first){
					if(e.target.nodeName == "IMG" ){
						_s.first = false;
						start();
					}else if(e.target.nodeName == "DIV" ){
						
					}					
				}else if(!_s.first ){
					end();
					if(e.target.nodeName == "IMG" && _self.DOM.Squares[old].Piece.Color == _self.DOM.Squares[_new].Piece.Color ){
						start();
					}else {
						_s.first = true;
						_self.GamePlay.checkMove(old,_new);
					}
					
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
					var d = document.createElement("div"),
					c = document.createElement("span"),
					r = document.createElement("span");
					d.classList.add("board-sq");
					d.style.width =parseInt(this.BoardSize/8)+"px";
					d.style.height =parseInt(this.BoardSize/8)+"px";

					c.classList.add("col");
					r.classList.add("row");
					
					if( ( (i%2==0) && (j%2==0) ) || ((i%2==1) && (j%2==1)) ){
						d.classList.add("light");
						d.setAttribute("sqcolor","light");
					}
					else{
						d.classList.add("dark");
						d.setAttribute("sqcolor","dark");
					}
					
					if(this.ShowSqNames){
						if(i == 7){
							var a = "";
							switch(j){
								case 0 : a = "a";break;
								case 1 : a = "b";break;
								case 2 : a = "c";break;
								case 3 : a = "d";break;
								case 4 : a = "e";break;
								case 5 : a = "f";break;
								case 6 : a = "g";break;
								case 7 : a = "h";break;
								
							}
							c.innerHTML = a;
						}
						if(j==0){
							var a = 8-i;
							r.innerHTML = a;
						}
					}


					d.appendChild(c);
					d.appendChild(r);
					_self.GamePlay.Squares[j+1][8-i] = 
					
					(new MyChess.Square({
						Element : d,
						SquareID : (i*8)+j ,
						ColName : colname,
						RowName : 8-i,
						ColNum  : j+1
					}));
					this.Squares[(i*8)+j] = _self.GamePlay.Squares[j+1][8-i];
					row.appendChild(d);
				};
				m.appendChild(row);
			};
			m.style.fontSize =parseInt( this.BoardSize/48<18 ? this.BoardSize/48 : 18 )+"px";

			var prom = document.createElement("div"),promsq1,promsq2,promsq3,promsq4,modal;
			prom.classList.add("board-promote");
			
			this.Element.appendChild (m);
			this.BoardMain = m;
			
			this.setSize(this.BoardSize);

			modal = document.createElement("div");
			modal.classList.add("promote-modal");
			modal.style.width = parseInt(this.BoardSize)+"px";
			modal.style.height = parseInt(this.BoardSize)+"px";
			modal.style.display = "none";

			prom.style.width = parseInt(this.BoardSize/2)+"px";
			prom.style.height = parseInt(this.BoardSize/2)+"px";
			prom.style.marginLeft = parseInt( (this.BoardSize /4)+2 )+"px";
			prom.style.marginTop = parseInt( (this.BoardSize/4)+2  )+"px";
			//prom.style.display=none;

			promsq1 = document.createElement("div");
			promsq1.classList.add("promote-sq");
			promsq1.classList.add("light");
			promsq1.style.width = parseInt(this.BoardSize/4)+"px";
			promsq1.style.height = parseInt(this.BoardSize/4)+"px";

			promsq2 = document.createElement("div");
			promsq2.classList.add("promote-sq");
			promsq2.classList.add("dark");
			promsq2.style.width = parseInt(this.BoardSize/4)+"px";
			promsq2.style.height = parseInt(this.BoardSize/4)+"px";

			promsq3 = document.createElement("div");
			promsq3.classList.add("promote-sq");
			promsq3.classList.add("dark");
			promsq3.style.width = parseInt(this.BoardSize/4)+"px";
			promsq3.style.height = parseInt(this.BoardSize/4)+"px";

			promsq4 = document.createElement("div");
			promsq4.classList.add("promote-sq");
			promsq4.classList.add("light");
			promsq4.style.width = parseInt(this.BoardSize/4)+"px";
			promsq4.style.height = parseInt(this.BoardSize/4)+"px";

			prom.appendChild(promsq1);
			prom.appendChild(promsq2);
			prom.appendChild(promsq3);
			prom.appendChild(promsq4);
			modal.appendChild(prom);

			this.Element.ModalPromote = modal;
			this.Element.ModalPromote.BoardPromote = prom;
			this.Element.appendChild(modal);
			
		}
		this.setSize = function(size){
			this.BoardSize = 
			size = 
			( size > window.innerHeight) ? window.innerHeight :parseInt(size) 
			var rows = this.BoardMain.getElementsByClassName('board-row');
			for (var i = 0; i < rows.length; i++) {
				rows[i].style.width = this.BoardSize + "px";
				rows[i].style.height = this.BoardSize/8 + "px";
			}

			var sqs = this.BoardMain.getElementsByClassName('board-sq');
			for (var i = 0; i < sqs.length; i++) {
				sqs[i].style.width = this.BoardSize/8 + "px";
				sqs[i].style.height = this.BoardSize/8 + "px";
			}

			var pcs = this.BoardMain.getElementsByClassName('board-pcs');
			for (var i = 0; i < pcs.length; i++) {
				pcs[i].style.width = parseInt(_self.DOM.BoardSize/10)+"px";
				pcs[i].style.height = parseInt(_self.DOM.BoardSize/10)+"px";
				pcs[i].style.marginLeft = parseInt((_self.DOM.BoardSize/8-_self.DOM.BoardSize/10)/2)+"px";
				pcs[i].style.marginTop = parseInt((_self.DOM.BoardSize/8-_self.DOM.BoardSize/10)/2)+"px";
			}
		}

		/* end of public functions */

		/* private functions */
		
		/* end of private functions*/

		/* construct*/
		this.Element = document.getElementById(elemid); //HTMLDOMObject
		this.Squares = []; // Array of Squares
		this.BoardSize = 400; // 
		this.AutoSize =  (opts && typeof opts.AutoSize != "undefined" ) ? opts.AutoSize : true;
		this.ShowPossibleMoves =  (opts && typeof opts.ShowPossibleMoves != "undefined" ) ? opts.ShowPossibleMoves : false;
		this.DragEvent =  (opts && typeof opts.DragEvent != "undefined" ) ? opts.DragEvent : false;
		this.ClickEvent =  (opts && typeof opts.ClickEvent != "undefined" ) ? opts.ClickEvent : true;
		this.ShowSqNames =  (opts && typeof opts.ShowSqNames != "undefined" ) ? opts.ShowSqNames : false;


		this.DefaultSize = (this.AutoSize) ? this.Element.clientWidth : 400; // Integer
		this.BoardSize = opts && opts.BoardSize ? opts.BoardSize : this.DefaultSize; // Integer
		this.Element.classList.add("mychess-main");
		this.MakeBoard();
		if(this.DragEvent)this.Drag = new MyChess.DOM.Drag(this.BoardMain);
		if(this.ClickEvent)this.Click = new MyChess.DOM.Click(this.BoardMain);
		this.setSize(this.BoardSize);
		this.PawnPromoteEvent = new MyChess.DOM.ClickPawnPromote(this.Element.ModalPromote.BoardPromote);
	}
	MyChess.Log = function(){

	}
	/* end of child classes */

	/* public functions */
	this.init = function(){
		this.GamePlay = new MyChess.GamePlay();
		this.DOM = new MyChess.DOM(_self.elemid,opts);
		this.GamePlay.StartGame();

	}
	this.setSize = function (size) {
		this.DOM.setSize(size);
	}

	/* end of public functions */

	/* construct */

	this.init();
}