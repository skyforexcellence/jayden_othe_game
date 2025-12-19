// AI4 - 使用位置權重表的 AI
function AI4(){
	this.getMove = function(board, player) {
		var moves = [];
		var scores = [];
		
		for (var i = 0; i < 64; i++) {
			if (board[i] === 0 && isValidMove(board, i, player)) {
				moves.push(i);
				scores.push(evaluateMove(board, i, player));
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
	
	function evaluateMove(board, pos, player) {
		var weightTable = [
			100, -20, 10, 5, 5, 10, -20, 100,
			-20, -50, -2, -2, -2, -2, -50, -20,
			10, -2, -1, -1, -1, -1, -2, 10,
			5, -2, -1, -1, -1, -1, -2, 5,
			5, -2, -1, -1, -1, -1, -2, 5,
			10, -2, -1, -1, -1, -1, -2, 10,
			-20, -50, -2, -2, -2, -2, -50, -20,
			100, -20, 10, 5, 5, 10, -20, 100
		];
		
		return weightTable[pos] + countFlips(board, pos, player) * 2;
	}
	
	function countFlips(board, pos, player) {
		var directions = [-9, -8, -7, -1, 1, 7, 8, 9];
		var totalFlips = 0;
		
		for (var dir of directions) {
			totalFlips += countDirectionFlips(board, pos, dir, player);
		}
		return totalFlips;
	}
	
	function countDirectionFlips(board, pos, dir, player) {
		var flips = 0;
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
				flips++;
			} else if (board[newPos] === player && foundOpponent) {
				return flips;
			} else {
				break;
			}
			newPos += dir;
		}
		return 0;
	}
	
	function isValidMove(board, pos, player) {
		var directions = [-9, -8, -7, -1, 1, 7, 8, 9];
		
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