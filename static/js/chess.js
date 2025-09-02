// Chess piece symbols
const PIECES = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
};

// Initial chess board position
const INITIAL_POSITION = {
    'a8': 'bR', 'b8': 'bN', 'c8': 'bB', 'd8': 'bQ', 'e8': 'bK', 'f8': 'bB', 'g8': 'bN', 'h8': 'bR',
    'a7': 'bP', 'b7': 'bP', 'c7': 'bP', 'd7': 'bP', 'e7': 'bP', 'f7': 'bP', 'g7': 'bP', 'h7': 'bP',
    'a2': 'wP', 'b2': 'wP', 'c2': 'wP', 'd2': 'wP', 'e2': 'wP', 'f2': 'wP', 'g2': 'wP', 'h2': 'wP',
    'a1': 'wR', 'b1': 'wN', 'c1': 'wB', 'd1': 'wQ', 'e1': 'wK', 'f1': 'wB', 'g1': 'wN', 'h1': 'wR'
};

let currentBoard = {...INITIAL_POSITION};
let selectedSquare = null;
let draggedPiece = null;

function initializeChessBoard() {
    const boardElement = document.getElementById('practice-board');
    if (!boardElement) return;
    
    // Create board squares
    for (let rank = 8; rank >= 1; rank--) {
        for (let file = 0; file < 8; file++) {
            const fileChar = String.fromCharCode(97 + file); // a-h
            const square = fileChar + rank;
            
            const squareElement = document.createElement('div');
            squareElement.className = `chess-square ${(rank + file) % 2 === 0 ? 'dark' : 'light'}`;
            squareElement.dataset.square = square;
            
            // Add coordinate labels
            if (file === 0) {
                const rankLabel = document.createElement('div');
                rankLabel.className = 'rank-label';
                rankLabel.textContent = rank;
                rankLabel.style.position = 'absolute';
                rankLabel.style.top = '2px';
                rankLabel.style.left = '2px';
                rankLabel.style.fontSize = '10px';
                rankLabel.style.fontWeight = 'bold';
                squareElement.appendChild(rankLabel);
            }
            
            if (rank === 1) {
                const fileLabel = document.createElement('div');
                fileLabel.className = 'file-label';
                fileLabel.textContent = fileChar;
                fileLabel.style.position = 'absolute';
                fileLabel.style.bottom = '2px';
                fileLabel.style.right = '2px';
                fileLabel.style.fontSize = '10px';
                fileLabel.style.fontWeight = 'bold';
                squareElement.appendChild(fileLabel);
            }
            
            // Add event listeners
            squareElement.addEventListener('click', handleSquareClick);
            squareElement.addEventListener('dragover', handleDragOver);
            squareElement.addEventListener('drop', handleDrop);
            squareElement.addEventListener('dragstart', handleDragStart);
            
            boardElement.appendChild(squareElement);
        }
    }
    
    // Set up control buttons
    document.getElementById('reset-board').addEventListener('click', resetBoard);
    document.getElementById('clear-board').addEventListener('click', clearBoard);
    
    // Render initial position
    renderBoard();
}

function renderBoard() {
    const squares = document.querySelectorAll('.chess-square');
    
    squares.forEach(square => {
        const squareId = square.dataset.square;
        const piece = currentBoard[squareId];
        
        // Clear square content except labels
        const labels = square.querySelectorAll('.rank-label, .file-label');
        square.innerHTML = '';
        labels.forEach(label => square.appendChild(label));
        
        if (piece) {
            const pieceElement = document.createElement('span');
            pieceElement.textContent = PIECES[piece];
            pieceElement.draggable = true;
            pieceElement.style.cursor = 'grab';
            pieceElement.style.userSelect = 'none';
            
            // Definir cores específicas para cada time
            if (piece.startsWith('w')) {
                pieceElement.style.color = '#ffffff';
                pieceElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            } else {
                pieceElement.style.color = '#1a1a1a';
                pieceElement.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.3)';
            }
            
            square.appendChild(pieceElement);
        }
    });
}

function handleSquareClick(event) {
    const square = event.currentTarget.dataset.square;
    
    if (selectedSquare) {
        if (selectedSquare === square) {
            // Deselect
            clearSelection();
        } else {
            // Move piece
            movePiece(selectedSquare, square);
            clearSelection();
        }
    } else if (currentBoard[square]) {
        // Select piece
        selectedSquare = square;
        event.currentTarget.classList.add('selected');
    }
}

function handleDragStart(event) {
    const square = event.target.parentElement.dataset.square;
    if (currentBoard[square]) {
        draggedPiece = {
            from: square,
            piece: currentBoard[square]
        };
        event.dataTransfer.effectAllowed = 'move';
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const toSquare = event.currentTarget.dataset.square;
    
    if (draggedPiece && draggedPiece.from !== toSquare) {
        movePiece(draggedPiece.from, toSquare);
    }
    
    draggedPiece = null;
}

function movePiece(from, to) {
    if (currentBoard[from]) {
        currentBoard[to] = currentBoard[from];
        delete currentBoard[from];
        renderBoard();
    }
}

function clearSelection() {
    selectedSquare = null;
    document.querySelectorAll('.chess-square').forEach(square => {
        square.classList.remove('selected');
    });
}

function resetBoard() {
    currentBoard = {...INITIAL_POSITION};
    clearSelection();
    renderBoard();
}

function clearBoard() {
    currentBoard = {};
    clearSelection();
    renderBoard();
}

// Remove drag-over class when dragging leaves
document.addEventListener('dragleave', function(event) {
    if (event.target.classList.contains('chess-square')) {
        event.target.classList.remove('drag-over');
    }
});
