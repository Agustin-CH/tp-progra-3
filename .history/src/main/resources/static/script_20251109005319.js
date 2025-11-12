const API_URL = 'http://localhost:8080/api/knights-tour';

let currentSolution = null;
let pointsBoard = null;

const elements = {
    algorithm: document.getElementById('algorithm'),
    boardSize: document.getElementById('boardSize'),
    startRow: document.getElementById('startRow'),
    startCol: document.getElementById('startCol'),
    maxMoves: document.getElementById('maxMoves'),
    solveBtn: document.getElementById('solveBtn'),
    animateBtn: document.getElementById('animateBtn'),
    generatePoints: document.getElementById('generatePoints'),
    loader: document.getElementById('loader'),
    results: document.getElementById('results'),
    resultContent: document.getElementById('resultContent'),
    board: document.getElementById('board'),
    dpOptions: document.getElementById('dpOptions')
};

elements.algorithm.addEventListener('change', handleAlgorithmChange);
elements.solveBtn.addEventListener('click', solve);
elements.animateBtn.addEventListener('click', animate);
elements.generatePoints.addEventListener('click', generatePoints);
elements.boardSize.addEventListener('change', updateMaxValues);

updateMaxValues();
handleAlgorithmChange();

function handleAlgorithmChange() {
    const algo = elements.algorithm.value;
    elements.dpOptions.style.display = algo === 'dynamic' ? 'block' : 'none';
    clearResults();
}

function updateMaxValues() {
    const size = parseInt(elements.boardSize.value);
    elements.startRow.max = size - 1;
    elements.startCol.max = size - 1;
}

function clearResults() {
    currentSolution = null;
    elements.animateBtn.disabled = true;
    elements.results.style.display = 'none';
    elements.board.innerHTML = '';
}

async function solve() {
    const algo = elements.algorithm.value;
    const boardSize = parseInt(elements.boardSize.value);
    const startRow = parseInt(elements.startRow.value);
    const startCol = parseInt(elements.startCol.value);

    if (startRow >= boardSize || startCol >= boardSize) {
        alert('La posición inicial debe estar dentro del tablero');
        return;
    }

    showLoader(true);
    elements.solveBtn.disabled = true;

    try {
        if (algo === 'compare') {
            await solveCompare(boardSize, startRow, startCol);
        } else if (algo === 'dynamic') {
            await solveDynamic(boardSize, startRow, startCol);
        } else {
            await solveSingle(algo, boardSize, startRow, startCol);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        showLoader(false);
        elements.solveBtn.disabled = false;
    }
}

async function solveSingle(algo, boardSize, startRow, startCol) {
    const endpoint = algo === 'backtracking' ? 'backtracking' : 'warnsdorff';
    const url = `${API_URL}/${endpoint}?boardSize=${boardSize}&startRow=${startRow}&startCol=${startCol}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    currentSolution = data;
    displayResults(data);
    renderBoard(data.board);
    
    if (data.success) {
        elements.animateBtn.disabled = false;
    }
}

async function solveCompare(boardSize, startRow, startCol) {
    const url = `${API_URL}/compare?boardSize=${boardSize}&startRow=${startRow}&startCol=${startCol}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    displayComparison(data);
    
    if (data.warnsdorff.success) {
        renderBoard(data.warnsdorff.board);
    } else if (data.backtracking.success) {
        renderBoard(data.backtracking.board);
    }
}

async function solveDynamic(boardSize, startRow, startCol) {
    const maxMoves = parseInt(elements.maxMoves.value);
    
    if (!pointsBoard || pointsBoard.length !== boardSize) {
        pointsBoard = await fetchPointsBoard(boardSize);
    }
    
    const response = await fetch(`${API_URL}/dynamic-programming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            boardSize: boardSize,
            startRow: startRow,
            startCol: startCol,
            maxMoves: maxMoves,
            pointsBoard: pointsBoard
        })
    });
    
    const data = await response.json();
    currentSolution = data;
    displayResults(data);
    renderBoardWithPoints(data.board, pointsBoard);
    elements.animateBtn.disabled = false;
}

async function generatePoints() {
    const boardSize = parseInt(elements.boardSize.value);
    pointsBoard = await fetchPointsBoard(boardSize);
    alert('Tablero de puntos generado');
}

async function fetchPointsBoard(boardSize) {
    const response = await fetch(`${API_URL}/generate-points-board?boardSize=${boardSize}`);
    return await response.json();
}

function displayResults(data) {
    elements.results.style.display = 'block';
    elements.resultContent.innerHTML = `
        <p><strong>Algoritmo:</strong> ${data.algorithmName}</p>
        <p><strong>Resultado:</strong> ${data.success ? '✓ Exitoso' : '✗ Fallido'}</p>
        <p><strong>Tiempo:</strong> ${data.executionTimeMs} ms</p>
        <p><strong>Pasos explorados:</strong> ${data.stepsExplored.toLocaleString()}</p>
        <p><strong>Complejidad:</strong> ${data.complexity.timeComplexity}</p>
    `;
}

function displayComparison(data) {
    elements.results.style.display = 'block';
    elements.resultContent.innerHTML = `
        <div class="comparison-grid">
            <div class="comparison-card">
                <h4>Backtracking</h4>
                <div class="metric">
                    <span>Tiempo:</span>
                    <span class="metric-value">${data.backtracking.executionTimeMs} ms</span>
                </div>
                <div class="metric">
                    <span>Pasos:</span>
                    <span class="metric-value">${data.backtracking.stepsExplored.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Resultado:</span>
                    <span class="metric-value">${data.backtracking.success ? '✓' : '✗'}</span>
                </div>
            </div>
            
            <div class="comparison-card">
                <h4>Warnsdorff</h4>
                <div class="metric">
                    <span>Tiempo:</span>
                    <span class="metric-value">${data.warnsdorff.executionTimeMs} ms</span>
                </div>
                <div class="metric">
                    <span>Pasos:</span>
                    <span class="metric-value">${data.warnsdorff.stepsExplored.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Resultado:</span>
                    <span class="metric-value">${data.warnsdorff.success ? '✓' : '✗'}</span>
                </div>
            </div>
        </div>
        <p style="margin-top: 10px; font-size: 12px;">
            ${data.warnsdorff.executionTimeMs < data.backtracking.executionTimeMs 
                ? `Warnsdorff fue ${(data.backtracking.executionTimeMs / (data.warnsdorff.executionTimeMs || 1)).toFixed(1)}x más rápido`
                : 'Resultados similares'}
        </p>
    `;
}

function renderBoard(board) {
    if (!board) return;
    
    const size = board.length;
    elements.board.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    elements.board.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            
            const value = board[i][j];
            if (value !== -1) {
                cell.textContent = value;
                cell.classList.add('visited');
                
                if (value === 0) {
                    cell.classList.add('start');
                } else if (value === size * size - 1) {
                    cell.classList.add('end');
                }
            }
            
            elements.board.appendChild(cell);
        }
    }
}

function renderBoardWithPoints(board, points) {
    if (!board || !points) return;
    
    const size = board.length;
    elements.board.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    elements.board.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell with-points ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.setAttribute('data-points', points[i][j]);
            
            const value = board[i][j];
            if (value !== -1) {
                cell.textContent = value;
                cell.classList.add('visited');
                
                if (value === 0) {
                    cell.classList.add('start');
                }
            }
            
            elements.board.appendChild(cell);
        }
    }
}

function animate() {
    if (!currentSolution || !currentSolution.path) return;
    
    elements.animateBtn.disabled = true;
    elements.solveBtn.disabled = true;
    
    const path = currentSolution.path;
    const size = currentSolution.board.length;
    
    // Crear tablero vacío
    elements.board.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    elements.board.innerHTML = '';
    
    const cells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.dataset.row = i;
            cell.dataset.col = j;
            elements.board.appendChild(cell);
            cells.push(cell);
        }
    }
    
    // Animar paso a paso
    let step = 0;
    const interval = setInterval(() => {
        if (step >= path.length) {
            clearInterval(interval);
            elements.animateBtn.disabled = false;
            elements.solveBtn.disabled = false;
            return;
        }
        
        const pos = path[step];
        const cell = cells.find(c => 
            parseInt(c.dataset.row) === pos.row && 
            parseInt(c.dataset.col) === pos.col
        );
        
        if (cell) {
            cell.textContent = step;
            cell.classList.add('visited');
            
            if (step === 0) {
                cell.classList.add('start');
            } else if (step === path.length - 1) {
                cell.classList.add('end');
            }
        }
        
        step++;
    }, 200);
}

function showLoader(show) {
    elements.loader.style.display = show ? 'block' : 'none';
}
