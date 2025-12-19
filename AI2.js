// AI2 - 偏好角落和邊緣位置的 AI
function AI2(){
	this.getMove = function(board, player) {
		var moves = [];
		var scores = [];
		
		for (var i = 0; i < 64; i++) {
			if (board[i] === 0 && isValidMove(board, i, player)) {
				moves.push(i);
				scores.push(evaluatePosition(i));
			}
		}
		
		if (moves.length === 0) return -1;
		
		var maxScore = Math.max(...scores);
		var bestMoves = [];
		for (var i = 0; i < moves.length; i++) {
			if (scores[i] === maxScore) {
				bestMoves.push(moves[i]);
			}
		}
		
		return bestMoves[Math.floor(Math.random() * bestMoves.length)];
	};
	
	function evaluatePosition(pos) {
		var corners = [0, 7, 56, 63];
		var edges = [];
		
		// 收集邊緣位置（除了角落）
		for (var i = 0; i < 8; i++) {
			if (i !== 0 && i !== 7) edges.push(i);
			if (i !== 0 && i !== 7) edges.push(56 + i);
			if (i !== 0 && i !== 7) edges.push(i * 8);
			if (i !== 0 && i !== 7) edges.push(i * 8 + 7);
		}
		
		if (corners.includes(pos)) return 100;
		if (edges.includes(pos)) return 50;
		return 10;
	}
	
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