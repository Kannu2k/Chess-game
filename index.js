
const vals = {
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8
};
let selectedPiece;
let parentElement;

const body = document.querySelector('body');
body.addEventListener('dragover', dragOver);
body.addEventListener('drop', dropPiece);

const board = document.getElementById('board');

// Function to add piece images
function addPiece(tile, rank, file) {
    const piece = document.createElement("img");

    if (rank === 7) {
        piece.classList.add('black');
        piece.src = "/Pieces/pawn-b.svg";
        piece.classList.add('pawn');
        piece.draggable = false;
    } else if (rank === 2) {
        piece.classList.add('white');
        piece.src = "/Pieces/pawn-w.svg";
        piece.classList.add('pawn');
        piece.draggable = true;
    } else if (rank === 8) {
        piece.classList.add('black');
        if (file === 'A' || file === 'H') {
            piece.src = "/Pieces/rook-b.svg";
            piece.classList.add('rook');
        } else if (file === 'B' || file === 'G') {
            piece.src = "/Pieces/knight-b.svg";
            piece.classList.add('knight');
        } else if (file === 'C' || file === 'F') {
            piece.src = "/Pieces/bishop-b.svg";
            piece.classList.add('bishop');
        } else if (file === 'D') {
            piece.src = "/Pieces/queen-b.svg";
            piece.classList.add('queen');
        } else {
            piece.src = "/Pieces/king-b.svg";
            piece.classList.add('king');
        }

        piece.draggable = false;
    } else if (rank === 1) {
        piece.classList.add('white');
        if (file === 'A' || file === 'H') {
            piece.src = "/Pieces/rook-w.svg";
            piece.classList.add('rook');
        } else if (file === 'B' || file === 'G') {
            piece.src = "/Pieces/knight-w.svg";
            piece.classList.add('knight');
        } else if (file === 'C' || file === 'F') {
            piece.src = "/Pieces/bishop-w.svg";
            piece.classList.add('bishop');
        } else if (file === 'D') {
            piece.src = "/Pieces/queen-w.svg";
            piece.classList.add('queen');

        } else {
            piece.src = "/Pieces/king-w.svg";
            piece.classList.add('king');
        }

        piece.draggable = true;
    }

    piece.style.width = '100px';

    piece.addEventListener('dragstart', dragStart);

    tile.appendChild(piece);
}

// Function to create a tile
function createTile(rank, file) {
    const tile = document.createElement("div");
    const tileClass = file + rank;
    tile.classList.add(tileClass);

    // Set tile color based on position
    if ((rank + vals[file]) % 2 === 0) {
        tile.style.backgroundColor = 'green';
    } else {
        tile.style.backgroundColor = 'white';
    }

    tile.style.width = '100px';
    tile.style.height = '100px';
    tile.style.display = 'inline-block';
    tile.addEventListener('dragover', dragOver);
    tile.addEventListener('drop', dropPiece);

    board.appendChild(tile);

    // Add pieces to the appropriate ranks
    if (rank === 1 || rank === 2 || rank === 7 || rank === 8) {
        addPiece(tile, rank, file);
    }
}

// ALL DRAG FUNCTIONS 
/////////////////////////////////////////////////////////
function dragStart(e) {
    parentElement = e.target.parentNode;
    selectedPiece = e.target;
    e.target.style.opacity = '0';
}

function dragOver(e) {
    e.preventDefault();
}

function dropPiece(e) {
    e.preventDefault();
    selectedPiece.style.opacity = '1';

    // Not to move a piece on another piece
    if (e.target.nodeName != 'IMG' && e.target.nodeName != 'BODY') {
        if (isValidMove(parentElement, e.target, selectedPiece)) {
            e.target.appendChild(selectedPiece);
            switchColors(selectedPiece);
            
        } else {
            returntoSquare();
        }
    } else if (e.target.nodeName == 'IMG') {
        if (e.target.classList[0] == selectedPiece.classList[0]) {
            returntoSquare();
        } else {
            if (isValidMove(parentElement, e.target.parentNode, selectedPiece)) {
                capturePiece(e.target);
                switchColors(selectedPiece);
                
            } else {
                returntoSquare();
            }
        }
    } else {
        returntoSquare();
    }

    selectedPiece = null;
    parentElement = null;
}

function switchColors(selectedPiece) {
    let colorThatJustMoved = selectedPiece.classList[0];
    let allMovedColors;
    let allNotMovedColors;

    if (colorThatJustMoved == 'white') {
        allMovedColors = document.querySelectorAll('.white');
        allNotMovedColors = document.querySelectorAll('.black');
    } else {
        allMovedColors = document.querySelectorAll('.black');
        allNotMovedColors = document.querySelectorAll('.white');
    }

    for (let i = 0; i < allMovedColors.length; i++) {
        allMovedColors[i].draggable = false;
    }

    for (let i = 0; i < allNotMovedColors.length; i++) {
        allNotMovedColors[i].draggable = true;
    }
}

function capturePiece(piece) {
    const p1 = piece.parentNode;
    p1.removeChild(piece);
    p1.appendChild(selectedPiece);
}

function returntoSquare() {
    parentElement.appendChild(selectedPiece);
}

/////////////////////////////////////////////////////////////

// Create 64 squares
for (let i = 8; i >= 1; i--) {
    for (let j = 0; j < 8; j++) {
        let file = String.fromCharCode(65 + j);
        createTile(i, file);
    }
}

// Check if the move is valid
function isValidMove(src, dst, selectedPiece) {
    let srcFile = vals[src.classList[0][0]];
    let dstFile = vals[dst.classList[0][0]];
    let srcRank = parseInt(src.classList[0][1]);
    let dstRank = parseInt(dst.classList[0][1]);
    let pieceColor = selectedPiece.classList[0];
    let pieceType = selectedPiece.classList[1];

    if (srcFile == dstFile && srcRank == dstRank) return false;

    // Function to check if there are pieces in the path between src and dst
    function hasObstacles(srcFile, srcRank, dstFile, dstRank) {
        let fileStep = srcFile === dstFile ? 0 : (dstFile - srcFile) / Math.abs(dstFile - srcFile);
        let rankStep = srcRank === dstRank ? 0 : (dstRank - srcRank) / Math.abs(dstRank - srcRank);
        let file = srcFile + fileStep;
        let rank = srcRank + rankStep;

        while (file !== dstFile || rank !== dstRank) {
            let tile = document.querySelector(`.${String.fromCharCode(64 + file)}${rank}`);
            if (tile.hasChildNodes()) {
                return true;
            }
            file += fileStep;
            rank += rankStep;
        }
        return false;
    }

    if (pieceType === 'pawn') {
        if (dst.hasChildNodes()) {
            if (pieceColor === 'white') {
                return dstRank === srcRank + 1 && (dstFile === srcFile + 1 || dstFile === srcFile - 1);
            } else if (pieceColor === 'black') {
                return dstRank === srcRank - 1 && (dstFile === srcFile + 1 || dstFile === srcFile - 1);
            }
        } else {
            if (pieceColor === 'white') {
                if (srcRank === 2) {
                    return dstFile === srcFile && dstRank <= srcRank + 2 && !hasObstacles(srcFile, srcRank, dstFile, dstRank);
                } else {
                    return dstFile === srcFile && dstRank <= srcRank + 1 && !hasObstacles(srcFile, srcRank, dstFile, dstRank);
                }
            } else if (pieceColor === 'black') {
                if (srcRank === 7) {
                    return dstFile === srcFile && dstRank >= srcRank - 2 && !hasObstacles(srcFile, srcRank, dstFile, dstRank);
                } else {
                    return dstFile === srcFile && dstRank >= srcRank - 1 && !hasObstacles(srcFile, srcRank, dstFile, dstRank);
                }
            }
        }
    }

    if (pieceType === 'rook') {
        return (dstFile === srcFile || dstRank === srcRank) && !hasObstacles(srcFile, srcRank, dstFile, dstRank);
    }

    if (pieceType === 'bishop') {
        return Math.abs(srcFile - dstFile) === Math.abs(srcRank - dstRank) && !hasObstacles(srcFile, srcRank, dstFile, dstRank);
    }

    if (pieceType === 'queen') {
        return ((dstFile === srcFile || dstRank === srcRank) || (Math.abs(srcFile - dstFile) === Math.abs(srcRank - dstRank))) && !hasObstacles(srcFile, srcRank, dstFile, dstRank);
    }

    if (pieceType === 'king') {
        if (Math.abs(srcFile - dstFile) <= 1 && Math.abs(srcRank - dstRank) <= 1) {
            return true;
        }
        return false;
    }

    if (pieceType === 'knight') {
        return (Math.abs(srcFile - dstFile) === 2 && Math.abs(srcRank - dstRank) === 1) || (Math.abs(srcFile - dstFile) === 1 && Math.abs(srcRank - dstRank) === 2);
    }

    return false;
}
