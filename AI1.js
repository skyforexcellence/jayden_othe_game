// AI1 - 最簡單的 AI，隨機選擇合法位置
function AI1(){
	this.getMove = function(board, player) {
		var moves = [];
		for (var i = 0; i < 64; i++) {
			if (board[i] === 0 && isValidMove(board, i, player)) {
				moves.push(i);
			}
		}
		if (moves.length === 0) return -1;
		return moves[Math.floor(Math.random() * moves.length)];
	};
	
	function isValidMove(board, pos, player) {
		var directions = [-9, -8, -7, -1, 1, 7, 8, 9];
		var row = Math.floor(pos / 8);
		var col = pos % 8;
		
		for (var dir of directions) {
			if (checkDirection(board, pos, dir, player)) {
				return true;
			}
		}
		return false;
	}
	
	function checkDirection(board, pos, dir, player) {
		var newPos = pos + dir;
		var foundOpponent = false;
		
		while (newPos >= 0 && newPos < 64) {
			var newRow = Math.floor(newPos / 8);
			var newCol = newPos % 8;
			var currentRow = Math.floor((newPos - dir) / 8);
			var currentCol = (newPos - dir) % 8;
			
			if (Math.abs(newRow - currentRow) > 1 || Math.abs(newCol - currentCol) > 1) {
				break;
			}
			
			if (board[newPos] === 0) break;
			if (board[newPos] === -player) {
				foundOpponent = true;
			} else if (board[newPos] === player && foundOpponent) {
				return true;
			} else {
				break;
			}
			newPos += dir;
		}
		return false;
	}
}