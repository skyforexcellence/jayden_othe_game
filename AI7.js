// AI7 - 最強的 AI（4層深度 + 高級評估）
function AI7(){
	this.getMove = function(board, player) {
		var moves = [];
		var scores = [];
		
		for (var i = 0; i < 64; i++) {
			if (board[i] === 0 && isValidMove(board, i, player)) {
				moves.push(i);
				scores.push(minimax(board, i, player, 4, false, -Infinity, Infinity));
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
			120, -20, 20, 5, 5, 20, -20, 120,
			-20, -40, -5, -5, -5, -5, -40, -20,
			20, -5, 15, 3, 3, 15, -5, 20,
			5, -5, 3, 0, 0, 3, -5, 5,
			5, -5, 3, 0, 0, 3, -5, 5,
			20, -5, 15, 3, 3, 15, -5, 20,
			-20, -40, -5, -5, -5, -5, -40, -20,
			120, -20, 20, 5, 5, 20, -20, 120
		];
		
		var score = 0;
		var playerPieces = 0;
		var opponentPieces = 0;
		
		for (var i = 0; i < 64; i++) {
			if (board[i] === player) {
				score += weightTable[i];
				playerPieces++;
			} else if (board[i] === -player) {
				score -= weightTable[i];
				opponentPieces++;
			}
		}
		
		var corners = [0, 7, 56, 63];
		var playerCorners = 0;
		var opponentCorners = 0;
		
		for (var corner of corners) {
			if (board[corner] === player) playerCorners++;
			else if (board[corner] === -player) opponentCorners++;
		}
		
		score += (playerCorners - opponentCorners) * 100;
		
		var mobility = getValidMoves(board, player).length - getValidMoves(board, -player).length;
		score += mobility * 15;
		
		var frontierScore = evaluateFrontier(board, player);
		score += frontierScore * 10;
		
		var emptySquares = 64 - playerPieces - opponentPieces;
		if (emptySquares < 10) {
			score += (playerPieces - opponentPieces) * 50;
		}
		
		return score;
	}
	
	function evaluateFrontier(board, player) {
		var playerFrontier = 0;
		var opponentFrontier = 0;
		
		for (var i = 0; i < 64; i++) {
			if (board[i] !== 0) {
				var isFrontier = hasAdjacentEmpty(board, i);
				if (isFrontier) {
					if (board[i] === player) playerFrontier++;
					else opponentFrontier++;
				}
			}
		}
		
		return opponentFrontier - playerFrontier;
	}
	
	function hasAdjacentEmpty(board, pos) {
		var directions = [-9, -8, -7, -1, 1, 7, 8, 9];
		var row = Math.floor(pos / 8);
		var col = pos % 8;
		
		for (var dir of directions) {
			var newPos = pos + dir;
			if (newPos >= 0 && newPos < 64) {
				var newRow = Math.floor(newPos / 8);
				var newCol = newPos % 8;
				if (Math.abs(newRow - row) <= 1 && Math.abs(newCol - col) <= 1) {
					if (board[newPos] === 0) return true;
				}
			}
		}
		return false;
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