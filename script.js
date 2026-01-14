// 1. Individual Player Factory
function createPlayer(name, isCPU = false, symbol) {
    return {
        name,
        isCPU,
        playedMoves: [],
        lastMove: null,
        score: 0,
        symbol
    };
}

// 2. Board Array Factory
function createGameBoard(size = 3) {
    return new Array(size).fill(null);
}

//all possible win paths
function generateWinningCombinations(gridSize = 3, winningRowSize = 3) {
    const wins = [];

    // Horizontal
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c <= gridSize - winningRowSize; c++) {
            const combo = [];
            for (let i = 0; i < winningRowSize; i++) combo.push(r * gridSize + (c + i));
            wins.push(combo);
        }
    }
    // Vertical
    for (let c = 0; c < gridSize; c++) {
        for (let r = 0; r <= gridSize - winningRowSize; r++) {
            const combo = [];
            for (let i = 0; i < winningRowSize; i++) combo.push((r + i) * gridSize + c);
            wins.push(combo);
        }
    }
    // Diagonal (TL to BR)
    for (let r = 0; r <= gridSize - winningRowSize; r++) {
        for (let c = 0; c <= gridSize - winningRowSize; c++) {
            const combo = [];
            for (let i = 0; i < winningRowSize; i++) combo.push((r + i) * gridSize + (c + i));
            wins.push(combo);
        }
    }
    // Anti-Diagonal (TR to BL)
    for (let r = 0; r <= gridSize - winningRowSize; r++) {
        for (let c = winningRowSize - 1; c < gridSize; c++) {
            const combo = [];
            for (let i = 0; i < winningRowSize; i++) combo.push((r + i) * gridSize + (c - i));
            wins.push(combo);
        }
    }
    return wins;
}

// 4. Judge Function
function checkWinner(winningCombinations, gameBoard, symbol) {
    for (let combo of winningCombinations) {
        if (combo.every(index => gameBoard[index] === symbol)) {
            return { hasWon: true, winningLine: combo };
        }
    }
    return { hasWon: false, winningLine: null };
}
//6.computer move
function generateComputerMoveIndex(winningCombinations, gameBoard, cpuSymbol, opponentSymbol) {
    // Helper to find a move that completes a line
    const findCompletingMove = (symbol) => {
        for (let combo of winningCombinations) {
            const pieces = combo.map(index => gameBoard[index]);
            const ownPieces = pieces.filter(p => p === symbol);
            const emptySpots = pieces.filter(p => p === null);

            // If we have (winningRowSize - 1) pieces and 1 empty spot, take it!
            if (ownPieces.length === combo.length - 1 && emptySpots.length === 1) {
                return combo[pieces.indexOf(null)];
            }
        }
        return null;
    };

    // 1. Try to Win
    const winningMove = findCompletingMove(cpuSymbol);
    if (winningMove !== null) return winningMove;

    // 2. Try to Block opponent
    const blockingMove = findCompletingMove(opponentSymbol);
    if (blockingMove !== null) return blockingMove;

    // 3. Pick Random available spot
    const availableMoves = gameBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}
// 6. Main Game Factory
function createGame(size = 3, winningRowSize = 3, p1Name, p2Name = "COMPUTER", p2IsCpu = true) {
    const winningCombinations = generateWinningCombinations(size, winningRowSize);
    
    const state = {
        isOngoing: true,
        player1: createPlayer(p1Name, false, "X"),
        player2: createPlayer(p2Name, p2IsCpu, "O"),
        gameBoard: createGameBoard(size * size),
        currentPlayer: null
    };

    state.currentPlayer = state.player1;

    return {
        state,
        winningCombinations,

        playMove(index) {
            if (!this.state.isOngoing) return { status: "error", message: "Game over" };
            if (this.state.gameBoard[index] !== null) return { status: "error", message: "Taken" };

            // Execute Human Move
            const result = this.executeLogic(index);
            
            // If the next player is a CPU and game is still ongoing, trigger CPU move
            if (this.state.isOngoing && this.state.currentPlayer.isCPU) {
                setTimeout(() => {
                    const cpuIndex = generateComputerMoveIndex(
                        this.winningCombinations, 
                        this.state.gameBoard, 
                        this.state.player2.symbol, 
                        this.state.player1.symbol
                    );
                    this.playMove(cpuIndex);
                }, 500); // Small delay so it feels natural
            }

            return result;
        },

        executeLogic(index) {
            const player = this.state.currentPlayer;
            this.state.gameBoard[index] = player.symbol;
            player.playedMoves.push(index);

            const winCheck = checkWinner(this.winningCombinations, this.state.gameBoard, player.symbol);
            if (winCheck.hasWon) {
                this.state.isOngoing = false;
                console.log({ status: "win", winner: player.name })
                return { status: "win", winner: player.name };
            }

            if (this.state.gameBoard.every(cell => cell !== null)) {
                this.state.isOngoing = false;
                console.log("draw")
                return { status: "draw" };
            }

            // Switch Turn
            this.state.currentPlayer = (player === this.state.player1) ? this.state.player2 : this.state.player1;
            return { status: "success", next: this.state.currentPlayer.name };
        }
    };
}

const myGame = createGame(5, 5, "Joy", "Janet", false);

console.log(myGame.playMove(0)); // Joy plays at index 0
