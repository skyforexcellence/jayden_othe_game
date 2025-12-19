// AI5 - 具有前瞻能力的 AI（2層深度）
function AI5(){
	this.getMove = function(board, player) {
		var moves = [];
		var scores = [];
		
		for (var i = 0; i < 64; i++) {
			if (board[i] === 0 && isValidMove(board, i, player)) {
				moves.push(i);
				scores.push(minimax(board, i, player, 2, false, -Infinity, Infinity));
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
	
	function minimax(board, move, player, depth, isMaximizing, alpha, beta) {
		var newBoard = board.slice();
		makeMove(newBoard, move, player);
		
		if (depth === 0) {
			return evaluateBoard(newBoard, player);
		}
		
		var currentPlayer = isMaximizing ? -player : player;
		var moves = getValidMoves(newBoard, currentPlayer);
		
		if (moves.length === 0) {
			return minimax(newBoard, -1, currentPlayer, depth - 1, !isMaximizing, alpha, beta);
		}
		
		if (isMaximizing) {
			var maxEval = -Infinity;
			for (var move of moves) {
				var eval = minimax(newBoard, move, currentPlayer, depth - 1, false, alpha, beta);
				maxEval = Math.max(maxEval, eval);
				alpha = Math.max(alpha, eval);
				if (beta <= alpha) break;
			}
			return maxEval;
		} else {
			var minEval = Infinity;
			for (var move of moves) {
				var eval = minimax(newBoard, move, currentPlayer, depth - 1, true, alpha, beta);
				minEval = Math.min(minEval, eval);
				beta = Math.min(beta, eval);
				if (beta <= alpha) break;
			}
			return minEval;
		}
	}
	
	function evaluateBoard(board, player) {
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
		
		var score = 0;
		for (var i = 0; i < 64; i++) {
			if (board[i] === player) score += weightTable[i];
			else if (board[i] === -player) score -= weightTable[i];
		}
		
		var mobility = getValidMoves(board, player).length - getValidMoves(board, -player).length;
		score += mobility * 10;
		
		return score;
	}
	
	function makeMove(board, pos, player) {
		if (pos === -1) return;
		board[pos] = player;
		
		var directions = [-9, -8, -7, -1, 1, 7, 8, 9];
		for (var dir of directions) {
			if (checkDirection(board, pos, dir, player)) {
				flipDirection(board, pos, dir, player);
			}
		}
	}
	
	function flipDirection(board, pos, dir, player) {
		var flips = [];
		var newPos = pos + dir;
		
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
				flips.push(newPos);
			} else if (board[newPos] === player) {
				for (var flip of flips) {
					board[flip] = player;
				}
				break;
			}
			newPos += dir;
		}
	}
	
	function getValidMoves(board, player) {
		var moves = [];
		for (var i = 0; i < 64; i++) {
			if (board[i] === 0 && isValidMove(board, i, player)) {
				moves.push(i);
			}
		}
		return moves;
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