package com.uade.progra3.knightstour.service;

import com.uade.progra3.knightstour.model.ComplexityAnalysis;
import com.uade.progra3.knightstour.model.Position;
import com.uade.progra3.knightstour.model.SolutionResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación del algoritmo de Backtracking para el Knight's Tour Problem.
 * 
 * Este algoritmo intenta todos los caminos posibles recursivamente.
 * Si encuentra un camino válido, lo retorna. Si no, hace backtrack y prueba otro camino.
 * 
 * Complejidad:
 * - Tiempo: O(8^(n²)) en el peor caso, ya que en cada casilla tenemos hasta 8 movimientos posibles
 * - Espacio: O(n²) para el tablero + O(n²) para la pila de recursión
 */
@Service
public class BacktrackingService {
    
    // Movimientos posibles del caballo en ajedrez (L-shape)
    private static final int[] ROW_MOVES = {2, 1, -1, -2, -2, -1, 1, 2};
    private static final int[] COL_MOVES = {1, 2, 2, 1, -1, -2, -2, -1};
    
    private int stepsExplored;
    private List<int[][]> allSolutions;  // Almacenar todas las soluciones encontradas
    private static final int MAX_SOLUTIONS = 6;  // Limitar a 6 soluciones (1 principal + 5 alternativas)

    public SolutionResult solve(int boardSize, int startRow, int startCol) {
        long startTime = System.currentTimeMillis();
        stepsExplored = 0;
        allSolutions = new ArrayList<>();
        
        int[][] board = new int[boardSize][boardSize];
        List<Position> path = new ArrayList<>();
        
        // Inicializar tablero con -1
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                board[i][j] = -1;
            }
        }
        
        // Comenzar desde la posición inicial (movimiento 0)
        board[startRow][startCol] = 0;
        path.add(new Position(startRow, startCol));
        
        // Buscar TODAS las soluciones (hasta MAX_SOLUTIONS)
        solveKnightTourAll(board, startRow, startCol, 1, boardSize, path);
        
        long executionTime = System.currentTimeMillis() - startTime;
        boolean success = !allSolutions.isEmpty();
        
        ComplexityAnalysis complexity = ComplexityAnalysis.builder()
            .timeComplexity("O(8^(n²))")
            .spaceComplexity("O(n²)")
            .description("Explora exhaustivamente todos los caminos posibles con backtracking. " +
                        "En cada casilla prueba hasta 8 movimientos diferentes.")
            .build();
        
        // Preparar soluciones alternativas (quitar la primera que se usará como principal)
        List<int[][]> alternatives = new ArrayList<>();
        if (allSolutions.size() > 1) {
            alternatives = allSolutions.subList(1, Math.min(allSolutions.size(), MAX_SOLUTIONS));
        }
        
        return SolutionResult.builder()
            .success(success)
            .board(success ? allSolutions.get(0) : null)
            .path(success ? reconstructPath(allSolutions.get(0), boardSize) : null)
            .executionTimeMs(executionTime)
            .stepsExplored(stepsExplored)
            .algorithmName("Backtracking")
            .complexity(complexity)
            .alternativeSolutions(alternatives)
            .message(success ? 
                    String.format("Solución encontrada. %d caminos diferentes encontrados.", allSolutions.size()) : 
                    "No se encontró solución para este tablero")
            .build();
    }

    /**
     * Función recursiva que busca TODAS las soluciones
     */
    private void solveKnightTourAll(int[][] board, int currentRow, int currentCol, 
                                    int moveCount, int boardSize, List<Position> path) {
        stepsExplored++;
        
        // Si ya encontramos suficientes soluciones, detener búsqueda
        if (allSolutions.size() >= maxSolutionsForCurrentBoard) {
            return;
        }
        
        // Caso base: hemos visitado todas las casillas
        if (moveCount == boardSize * boardSize) {
            // Guardar esta solución (copia del tablero)
            int[][] solutionCopy = new int[boardSize][boardSize];
            for (int i = 0; i < boardSize; i++) {
                for (int j = 0; j < boardSize; j++) {
                    solutionCopy[i][j] = board[i][j];
                }
            }
            allSolutions.add(solutionCopy);
            return;  // Continuar buscando más soluciones
        }
        
        // Probar todos los 8 posibles movimientos del caballo
        for (int i = 0; i < 8; i++) {
            int nextRow = currentRow + ROW_MOVES[i];
            int nextCol = currentCol + COL_MOVES[i];
            
            if (isSafe(board, nextRow, nextCol, boardSize)) {
                // Hacer el movimiento
                board[nextRow][nextCol] = moveCount;
                path.add(new Position(nextRow, nextCol));
                
                // Recursión: continuar desde esta nueva posición
                solveKnightTourAll(board, nextRow, nextCol, moveCount + 1, boardSize, path);
                
                // Backtrack: deshacer el movimiento para probar otros caminos
                board[nextRow][nextCol] = -1;
                path.remove(path.size() - 1);
            }
        }
    }

    /**
     * Reconstruye el path desde un tablero resuelto
     */
    private List<Position> reconstructPath(int[][] board, int boardSize) {
        List<Position> path = new ArrayList<>();
        int totalMoves = boardSize * boardSize;
        
        for (int move = 0; move < totalMoves; move++) {
            for (int i = 0; i < boardSize; i++) {
                for (int j = 0; j < boardSize; j++) {
                    if (board[i][j] == move) {
                        path.add(new Position(i, j));
                    }
                }
            }
        }
        
        return path;
    }

    /**
     * Verifica si una posición es válida y no ha sido visitada
     */
    private boolean isSafe(int[][] board, int row, int col, int boardSize) {
        return row >= 0 && row < boardSize && 
               col >= 0 && col < boardSize && 
               board[row][col] == -1;
    }
}

