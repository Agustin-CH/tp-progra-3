const API_URL = 'http://localhost:8080/api/knights-tour';

let currentSolution = null;
let pointsBoard = null;
let animationState = {
    currentStep: 0,
    cells: [],
    isAnimating: false
};

const elements = {
    algorithm: document.getElementById('algorithm'),
    boardSize: document.getElementById('boardSize'),
    startRow: document.getElementById('startRow'),
    startCol: document.getElementById('startCol'),
    maxMoves: document.getElementById('maxMoves'),
    solveBtn: document.getElementById('solveBtn'),
    generatePoints: document.getElementById('generatePoints'),
    loader: document.getElementById('loader'),
    results: document.getElementById('results'),
    resultContent: document.getElementById('resultContent'),
    board: document.getElementById('board'),
    dpOptions: document.getElementById('dpOptions'),
    animationControls: document.getElementById('animationControls'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    resetBtn: document.getElementById('resetBtn'),
    currentStepSpan: document.getElementById('currentStep'),
    totalStepsSpan: document.getElementById('totalSteps')
};

elements.algorithm.addEventListener('change', handleAlgorithmChange);
elements.solveBtn.addEventListener('click', solve);
elements.prevBtn.addEventListener('click', previousStep);
elements.nextBtn.addEventListener('click', nextStep);
elements.resetBtn.addEventListener('click', resetAnimation);
elements.generatePoints.addEventListener('click', generatePoints);
elements.boardSize.addEventListener('change', updateMaxValues);

updateMaxValues();
handleAlgorithmChange();

function renderAlternativeSolutionsInInfo(solutions) {
    const infoSection = document.getElementById('alternativesInfo');
    const container = document.getElementById('exampleSolutions');
    
    if (!container || !infoSection) return;
    
    // Mostrar la sección
    infoSection.style.display = 'block';
    container.innerHTML = '';
    
    solutions.forEach((board, index) => {
        const miniBoard = document.createElement('div');
        miniBoard.className = 'mini-board-small';
        miniBoard.title = `Click para ver solución ${index + 1}`;
        miniBoard.style.cursor = 'pointer';
        
        // Agregar click handler para cambiar al tablero alternativo
        miniBoard.onclick = () => {
            renderBoard(board);
            currentSolution.board = board;
            currentSolution.path = reconstructPathFromBoard(board);
            setupAnimation();
        };
        
        const size = board.length;
        const cellSize = 100 / size;
        // Calcular tamaño de fuente dinámico basado en el tamaño del tablero
        // Mini-tablero es 120px, así que cada celda es 120/size px
        const miniFontSize = Math.max(8, Math.floor(120 / size * 0.5));
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.style.width = cellSize + '%';
                cell.style.height = cellSize + '%';
                cell.style.float = 'left';
                cell.style.fontSize = miniFontSize + 'px';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontWeight = '600';
                
                const isLight = (i + j) % 2 === 0;
                const value = board[i][j];
                
                if (value !== -1) {
                    cell.style.background = isLight ? '#9db4d0' : '#6c8eae';
                    cell.style.color = 'white';
                    cell.textContent = value;
                } else {
                    cell.style.background = isLight ? '#f0d9b5' : '#b58863';
                }
                
                miniBoard.appendChild(cell);
            }
        }
        
        container.appendChild(miniBoard);
    });
}

function handleAlgorithmChange() {
    const algo = elements.algorithm.value;
    elements.dpOptions.style.display = algo === 'dynamic' ? 'block' : 'none';
    clearResults();
    
    // Limpiar pointsBoard si cambias a un algoritmo que no es PD
    if (algo !== 'dynamic') {
        pointsBoard = null;
    }
    
    // Mostrar información del algoritmo seleccionado
    const algoInfo = document.getElementById('algoInfo');
    const algoCard = document.getElementById('algoCard');
    
    if (!algoInfo || !algoCard) return;
    
    const algoMessages = {
        'backtracking': {
            title: 'Backtracking',
            description: 'Explora todos los caminos posibles. Complejidad: O(k^(n²)) donde k=8 son los movimientos del caballo'
        },
        'warnsdorff': {
            title: 'Warnsdorff (Greedy)',
            description: 'Elige siempre la casilla con menos opciones. Complejidad: O(n²)'
        },
        'dynamic': {
            title: 'Programación Dinámica',
            description: 'Maximiza puntos en k movimientos. Complejidad: O(n² × k)'
        },
        'compare': {
            title: 'Comparación',
            description: 'Compara Backtracking vs Warnsdorff en el mismo tablero'
        }
    };
    
    const selectedAlgo = algoMessages[algo];
    if (selectedAlgo) {
        algoCard.innerHTML = `<strong>${selectedAlgo.title}</strong><p>${selectedAlgo.description}</p>`;
        algoInfo.style.display = 'block';
    } else {
        algoInfo.style.display = 'none';
    }
}

function updateMaxValues() {
    const size = parseInt(elements.boardSize.value);
    elements.startRow.max = size - 1;
    elements.startCol.max = size - 1;
}

function clearResults() {
    currentSolution = null;
    elements.animationControls.style.display = 'none';
    elements.results.style.display = 'none';
    elements.board.innerHTML = '';
    
    // Ocultar caminos alternativos
    const alternativesInfo = document.getElementById('alternativesInfo');
    if (alternativesInfo) {
        alternativesInfo.style.display = 'none';
    }
    
    // Ocultar comparación
    const comparisonDiv = document.getElementById('comparisonResults');
    if (comparisonDiv) {
        comparisonDiv.style.display = 'none';
    }
    
    animationState = {
        currentStep: 0,
        cells: [],
        isAnimating: false
    };
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

    // Validación específica para Knight's Tour completo (no aplica a PD)
    if (algo !== 'dynamic' && (boardSize === 3 || boardSize === 4)) {
        const confirmMsg = `⚠️ Tableros de ${boardSize}×${boardSize} NO tienen solución matemáticamente.\n\n` +
                         `El Knight's Tour solo tiene solución para tableros ≥5×5.\n\n` +
                         `Razón: No hay suficientes conexiones válidas para visitar todas las casillas.\n\n` +
                         `¿Deseas intentarlo de todos modos? (El algoritmo no encontrará solución)`;
        
        if (!confirm(confirmMsg)) {
            return;
        }
    }

    // Advertencia para 5×5
    if (algo !== 'dynamic' && boardSize === 5) {
        console.log('⚠️ Tableros 5×5 tienen solución limitada. Algunas posiciones iniciales pueden fallar.');
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
    
    if (!response.ok) {
        const limit = algo === 'backtracking' ? '8×8' : '20×20';
        throw new Error(`Tamaño de tablero no válido. Límite para ${algo === 'backtracking' ? 'Backtracking' : 'Warnsdorff'}: ${limit}`);
    }
    
    const data = await response.json();
    
    currentSolution = data;
    displayResults(data);
    renderBoard(data.board);
    
    if (data.success) {
        setupAnimation();
    }
}

async function solveCompare(boardSize, startRow, startCol) {
    const url = `${API_URL}/compare?boardSize=${boardSize}&startRow=${startRow}&startCol=${startCol}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Tamaño de tablero no válido para comparación. Límite: 8×8');
    }
    
    const data = await response.json();
    
    displayComparison(data);
    
    if (data.warnsdorff.success) {
        renderBoard(data.warnsdorff.board);
        setupAnimation();
    } else if (data.backtracking.success) {
        renderBoard(data.backtracking.board);
        setupAnimation();
    } else {
        // Si ambos fallan, limpiar el tablero y mostrar mensaje
        elements.board.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No se encontró solución con ninguno de los dos algoritmos</p>';
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
    setupAnimation();
}

async function generatePoints() {
    const boardSize = parseInt(elements.boardSize.value);
    pointsBoard = await fetchPointsBoard(boardSize);
    
    // Visualizar el tablero de puntos generado
    renderPointsBoard(pointsBoard);
    
    elements.results.style.display = 'block';
    elements.resultContent.innerHTML = `
        <p style="color: #28a745; font-weight: 600;">✓ Tablero de puntos generado</p>
        <p style="font-size: 12px; color: #666;">Los números en rojo indican los puntos de cada casilla</p>
    `;
}

async function fetchPointsBoard(boardSize) {
    const response = await fetch(`${API_URL}/generate-points-board?boardSize=${boardSize}`);
    return await response.json();
}

function renderPointsBoard(points) {
    if (!points) return;
    
    const size = points.length;
    const cellSize = Math.max(30, Math.min(50, 450 / size));
    elements.board.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    elements.board.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            cell.style.fontSize = Math.max(12, cellSize / 3) + 'px';
            cell.style.fontWeight = '600';
            cell.style.color = '#d9534f'; // Rojo para los puntos
            cell.textContent = points[i][j];
            
            elements.board.appendChild(cell);
        }
    }
}

function displayResults(data) {
    elements.results.style.display = 'block';
    
    let html = `
        <p><strong>Algoritmo:</strong> ${data.algorithmName}</p>
        <p><strong>Resultado:</strong> ${data.success ? '✓ Exitoso' : '✗ Fallido'}</p>
        <p><strong>Tiempo:</strong> ${data.executionTimeMs} ms</p>
        <p><strong>Pasos explorados:</strong> ${data.stepsExplored.toLocaleString()}</p>
        <p><strong>Complejidad:</strong> ${data.complexity.timeComplexity}</p>
    `;
    
    // Agregar mensaje adicional si existe (ej: puntaje en DP)
    if (data.message) {
        html += `<p style="color: #28a745; font-weight: 600; margin-top: 10px;">${data.message}</p>`;
    }
    
    elements.resultContent.innerHTML = html;
    
    // Si hay soluciones alternativas, mostrarlas SOLO en la sección de info abajo (no aquí)
    if (data.alternativeSolutions && data.alternativeSolutions.length > 0) {
        renderAlternativeSolutionsInInfo(data.alternativeSolutions);
    } else {
        // Ocultar sección de alternativas si no hay
        const alternativesInfo = document.getElementById('alternativesInfo');
        if (alternativesInfo) {
            alternativesInfo.style.display = 'none';
        }
    }
}

function displayComparison(data) {
    // Mostrar comparación debajo del tablero (no en el panel izquierdo)
    const comparisonDiv = document.getElementById('comparisonResults');
    if (!comparisonDiv) return;
    
    comparisonDiv.style.display = 'block';
    comparisonDiv.innerHTML = `
        <div style="padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <h3 style="margin-bottom: 15px; text-align: center;">Comparación de Algoritmos</h3>
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
            <p style="margin-top: 15px; font-size: 13px; text-align: center; color: #555;">
                ${!data.backtracking.success && !data.warnsdorff.success 
                    ? '❌ Ninguno encontró solución para este tablero'
                    : !data.warnsdorff.success
                    ? '⚠️ Warnsdorff no completó el tour; Backtracking sí encontró solución'
                    : !data.backtracking.success
                    ? '⚠️ Backtracking no encontró solución; Warnsdorff sí completó el tour'
                    : data.warnsdorff.executionTimeMs < data.backtracking.executionTimeMs 
                    ? `⚡ Warnsdorff fue ${(data.backtracking.executionTimeMs / (data.warnsdorff.executionTimeMs || 1)).toFixed(1)}x más rápido`
                    : '📊 Resultados similares'}
            </p>
        </div>
    `;
}

function renderBoard(board) {
    if (!board) return;
    
    const size = board.length;
    const cellSize = Math.max(30, Math.min(50, 450 / size));
    elements.board.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    elements.board.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            cell.style.fontSize = Math.max(10, cellSize / 4) + 'px';
            
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
    const cellSize = Math.max(30, Math.min(50, 450 / size));
    elements.board.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    elements.board.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell with-points ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            cell.style.fontSize = Math.max(10, cellSize / 4) + 'px';
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

function setupAnimation() {
    if (!currentSolution || !currentSolution.path) return;
    
    const path = currentSolution.path;
    const size = currentSolution.board.length;
    const cellSize = Math.max(30, Math.min(50, 450 / size));
    
    // Crear tablero vacío
    elements.board.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    elements.board.innerHTML = '';
    
    animationState.cells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell ' + ((i + j) % 2 === 0 ? 'light' : 'dark');
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            cell.style.fontSize = Math.max(10, cellSize / 4) + 'px';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            // Si hay tablero de puntos (Programación Dinámica), agregar los puntos
            if (pointsBoard && pointsBoard[i] && pointsBoard[i][j] !== undefined) {
                cell.classList.add('with-points');
                cell.setAttribute('data-points', pointsBoard[i][j]);
            }
            
            elements.board.appendChild(cell);
            animationState.cells.push(cell);
        }
    }
    
    // Inicializar estado de animación
    animationState.currentStep = 0;
    animationState.isAnimating = true;
    
    // Mostrar controles
    elements.animationControls.style.display = 'block';
    elements.totalStepsSpan.textContent = path.length - 1;
    elements.currentStepSpan.textContent = 0;
    
    // Mostrar primer paso
    updateAnimationStep();
    updateButtonStates();
}

function nextStep() {
    if (!currentSolution || !currentSolution.path) return;
    
    const path = currentSolution.path;
    if (animationState.currentStep < path.length - 1) {
        animationState.currentStep++;
        updateAnimationStep();
        updateButtonStates();
    }
}

function previousStep() {
    if (animationState.currentStep > 0) {
        animationState.currentStep--;
        updateAnimationStep();
        updateButtonStates();
    }
}

function resetAnimation() {
    animationState.currentStep = 0;
    updateAnimationStep();
    updateButtonStates();
}

function updateAnimationStep() {
    if (!currentSolution || !currentSolution.path) return;
    
    const path = currentSolution.path;
    const currentStep = animationState.currentStep;
    
    // Limpiar todas las celdas
    animationState.cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('visited', 'start', 'end');
    });
    
    // Mostrar todos los pasos hasta el actual
    for (let step = 0; step <= currentStep; step++) {
        const pos = path[step];
        const cell = animationState.cells.find(c => 
            parseInt(c.dataset.row) === pos.row && 
            parseInt(c.dataset.col) === pos.col
        );
        
        if (cell) {
            cell.textContent = step;
            cell.classList.add('visited');
            
            if (step === 0) {
                cell.classList.add('start');
            } else if (step === currentStep) {
                cell.classList.add('end');  // Marcar posición actual
            }
        }
    }
    
    // Actualizar contador
    elements.currentStepSpan.textContent = currentStep;
}

function updateButtonStates() {
    const path = currentSolution.path;
    elements.prevBtn.disabled = animationState.currentStep === 0;
    elements.nextBtn.disabled = animationState.currentStep === path.length - 1;
}

function showLoader(show) {
    elements.loader.style.display = show ? 'block' : 'none';
}

function reconstructPathFromBoard(board) {
    const size = board.length;
    const path = [];
    const totalMoves = size * size;
    
    for (let move = 0; move < totalMoves; move++) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === move) {
                    path.push({ row: i, col: j });
                }
            }
        }
    }
    
    return path;
}
