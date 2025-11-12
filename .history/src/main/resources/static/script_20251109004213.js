const API_BASE_URL = 'http://localhost:8080/api/knights-tour';

let currentSolution = null;
let animationInterval = null;
let pointsBoard = null;

// Elementos del DOM
const algorithmSelect = document.getElementById('algorithm');
const boardSizeInput = document.getElementById('boardSize');
const startRowInput = document.getElementById('startRow');
const startColInput = document.getElementById('startCol');
const maxMovesInput = document.getElementById('maxMoves');
const solveBtn = document.getElementById('solveBtn');
const animateBtn = document.getElementById('animateBtn');
const generatePointsBtn = document.getElementById('generatePoints');
const loader = document.getElementById('loader');
const results = document.getElementById('results');
const resultContent = document.getElementById('resultContent');
const boardElement = document.getElementById('board');
const dpOptions = document.getElementById('dpOptions');
const complexityAnalysis = document.getElementById('complexityAnalysis');

// Event Listeners
algorithmSelect.addEventListener('change', handleAlgorithmChange);
solveBtn.addEventListener('click', handleSolve);
animateBtn.addEventListener('click', handleAnimate);
generatePointsBtn.addEventListener('click', handleGeneratePoints);
boardSizeInput.addEventListener('change', updateMaxValues);

// Inicialización
updateMaxValues();
handleAlgorithmChange();

function handleAlgorithmChange() {
    const algorithm = algorithmSelect.value;
    
    if (algorithm === 'dynamic') {
        dpOptions.style.display = 'block';
    } else {
        dpOptions.style.display = 'none';
    }

    // Limpiar resultados anteriores
    currentSolution = null;
    animateBtn.disabled = true;
    results.style.display = 'none';
    boardElement.innerHTML = '';
    complexityAnalysis.innerHTML = '';
}

function updateMaxValues() {
    const boardSize = parseInt(boardSizeInput.value);
    startRowInput.max = boardSize - 1;
    startColInput.max = boardSize - 1;
}

async function handleSolve() {
    const algorithm = algorithmSelect.value;
    const boardSize = parseInt(boardSizeInput.value);
    const startRow = parseInt(startRowInput.value);
    const startCol = parseInt(startColInput.value);

    // Validación
    if (startRow >= boardSize || startCol >= boardSize) {
        alert('La posición inicial debe estar dentro del tablero');
        return;
    }

    // Mostrar loader
    loader.style.display = 'block';
    solveBtn.disabled = true;
    results.style.display = 'none';
    animateBtn.disabled = true;

    try {
        if (algorithm === 'compare') {
            await solveAndCompare(boardSize, startRow, startCol);
        } else if (algorithm === 'dynamic') {
            await solveDynamicProgramming(boardSize, startRow, startCol);
        } else {
            await solveSingleAlgorithm(algorithm, boardSize, startRow, startCol);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al resolver: ' + error.message);
    } finally {
        loader.style.display = 'none';
        solveBtn.disabled = false;
    }
}

async function solveSingleAlgorithm(algorithm, boardSize, startRow, startCol) {
    const endpoint = algorithm === 'backtracking' ? 'backtracking' : 'warnsdorff';
    const url = `${API_BASE_URL}/${endpoint}?boardSize=${boardSize}&startRow=${startRow}&startCol=${startCol}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    currentSolution = data;
    displayResults(data);
    renderBoard(data.board, data.path);
    displayComplexityAnalysis([data]);
    
    if (data.success) {
        animateBtn.disabled = false;
    }
}

async function solveAndCompare(boardSize, startRow, startCol) {
    const url = `${API_BASE_URL}/compare?boardSize=${boardSize}&startRow=${startRow}&startCol=${startCol}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    displayComparisonResults(data);
    displayComplexityAnalysis([data.backtracking, data.warnsdorff]);
}

async function solveDynamicProgramming(boardSize, startRow, startCol) {
    const maxMoves = parseInt(maxMovesInput.value);
    
    // Si no hay tablero de puntos, generar uno
    if (!pointsBoard || pointsBoard.length !== boardSize) {
        pointsBoard = await generatePointsBoard(boardSize);
    }
    
    const url = `${API_BASE_URL}/dynamic-programming`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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
    renderBoardWithPoints(data.board, data.path, pointsBoard);
    displayComplexityAnalysis([data]);
    
    animateBtn.disabled = false;
}

async function handleGeneratePoints() {
    const boardSize = parseInt(boardSizeInput.value);
    pointsBoard = await generatePointsBoard(boardSize);
    alert('Tablero de puntos generado correctamente');
}

async function generatePointsBoard(boardSize) {
    const url = `${API_BASE_URL}/generate-points-board?boardSize=${boardSize}`;
    const response = await fetch(url);
    return await response.json();
}

function displayResults(data) {
    results.style.display = 'block';
    
    resultContent.innerHTML = `
        <p><strong>Algoritmo:</strong> ${data.algorithmName}</p>
        <p><strong>Estado:</strong> ${data.success ? '✅ Éxito' : '❌ Sin solución'}</p>
        <p><strong>Tiempo de ejecución:</strong> ${data.executionTimeMs} ms</p>
        <p><strong>Pasos explorados:</strong> ${data.stepsExplored.toLocaleString()}</p>
        <p><strong>Mensaje:</strong> ${data.message}</p>
    `;
}

function displayComparisonResults(data) {
    results.style.display = 'block';
    
    resultContent.innerHTML = `
        <div class="comparison-grid">
            <div class="comparison-card">
                <h3>Backtracking</h3>
                <div class="metric">
                    <span class="metric-label">Tiempo:</span>
                    <span class="metric-value">${data.backtracking.executionTimeMs} ms</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Pasos explorados:</span>
                    <span class="metric-value">${data.backtracking.stepsExplored.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Resultado:</span>
                    <span class="metric-value">${data.backtracking.success ? '✅ Éxito' : '❌ Fallo'}</span>
                </div>
            </div>
            
            <div class="comparison-card">
                <h3>Warnsdorff (Greedy)</h3>
                <div class="metric">
                    <span class="metric-label">Tiempo:</span>
                    <span class="metric-value">${data.warnsdorff.executionTimeMs} ms</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Pasos explorados:</span>
                    <span class="metric-value">${data.warnsdorff.stepsExplored.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Resultado:</span>
                    <span class="metric-value">${data.warnsdorff.success ? '✅ Éxito' : '❌ Fallo'}</span>
                </div>
            </div>
        </div>
        
        <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
            <strong>📊 Análisis:</strong> 
            ${data.warnsdorff.executionTimeMs < data.backtracking.executionTimeMs 
                ? `Warnsdorff fue ${(data.backtracking.executionTimeMs / data.warnsdorff.executionTimeMs).toFixed(2)}x más rápido que Backtracking.`
                : 'Backtracking fue más rápido en este caso.'
            }
            Warnsdorff exploró ${((1 - data.warnsdorff.stepsExplored / data.backtracking.stepsExplored) * 100).toFixed(1)}% menos pasos.
        </p>
    `;
    
    // Mostrar el tablero del algoritmo que tuvo éxito
    if (data.warnsdorff.success) {
        renderBoard(data.warnsdorff.board, data.warnsdorff.path);
    } else if (data.backtracking.success) {
        renderBoard(data.backtracking.board, data.backtracking.path);
    }
}

function displayComplexityAnalysis(solutions) {
    if (!solutions || solutions.length === 0) return;
    
    let html = '<table class="complexity-table">';
    html += '<thead><tr><th>Algoritmo</th><th>Complejidad Temporal</th><th>Complejidad Espacial</th><th>Descripción</th></tr></thead>';
    html += '<tbody>';
    
    solutions.forEach(solution => {
        if (solution && solution.complexity) {
            html += `
                <tr>
                    <td><strong>${solution.algorithmName}</strong></td>
                    <td><code>${solution.complexity.timeComplexity}</code></td>
                    <td><code>${solution.complexity.spaceComplexity}</code></td>
                    <td>${solution.complexity.description}</td>
                </tr>
            `;
        }
    });
    
    html += '</tbody></table>';
    complexityAnalysis.innerHTML = html;
}

function renderBoard(board, path) {
    if (!board) return;
    
    const size = board.length;
    boardElement.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    boardElement.innerHTML = '';
    
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
            
            boardElement.appendChild(cell);
        }
    }
}

function renderBoardWithPoints(board, path, points) {
    if (!board || !points) return;
    
    const size = board.length;
    boardElement.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    boardElement.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.classList.add('with-points');
            cell.setAttribute('data-points', points[i][j]);
            
            const value = board[i][j];
            if (value !== -1) {
                cell.textContent = value;
                cell.classList.add('visited');
                
                if (value === 0) {
                    cell.classList.add('start');
                } else if (value === path.length - 1) {
                    cell.classList.add('end');
                }
            }
            
            boardElement.appendChild(cell);
        }
    }
}

function handleAnimate() {
    if (!currentSolution || !currentSolution.path) return;
    
    animateBtn.disabled = true;
    solveBtn.disabled = true;
    
    const path = currentSolution.path;
    const size = currentSolution.board.length;
    
    // Limpiar tablero
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    
    // Crear tablero vacío
    const cells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.dataset.row = i;
            cell.dataset.col = j;
            boardElement.appendChild(cell);
            cells.push(cell);
        }
    }
    
    // Animar el camino
    let step = 0;
    animationInterval = setInterval(() => {
        if (step >= path.length) {
            clearInterval(animationInterval);
            animateBtn.disabled = false;
            solveBtn.disabled = false;
            return;
        }
        
        const pos = path[step];
        const cell = cells.find(c => 
            parseInt(c.dataset.row) === pos.row && 
            parseInt(c.dataset.col) === pos.col
        );
        
        if (cell) {
            cell.textContent = step;
            cell.classList.add('visited', 'current');
            
            if (step === 0) {
                cell.classList.add('start');
            } else if (step === path.length - 1) {
                cell.classList.add('end');
            }
            
            setTimeout(() => cell.classList.remove('current'), 500);
        }
        
        step++;
    }, 200);
}

