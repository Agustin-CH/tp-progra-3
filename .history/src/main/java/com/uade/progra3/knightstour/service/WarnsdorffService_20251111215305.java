package com.uade.progra3.knightstour.service;

import com.uade.progra3.knightstour.model.ComplexityAnalysis;
import com.uade.progra3.knightstour.model.Position;
import com.uade.progra3.knightstour.model.SolutionResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación de la Heurística de Warnsdorff para el Knight's Tour Problem.
 * 
 * Estrategia: En cada paso, el caballo se mueve a la casilla que tiene el menor
 * número de movimientos disponibles (casillas no visitadas alcanzables desde allí).
 * 
 * Esta heurística es mucho más eficiente que backtracking puro y casi siempre
 * encuentra una solución en tableros de tamaño razonable.
 * 
 * Complejidad:
 * - Tiempo: O(n²) donde n es el tamaño del tablero
 * - Espacio: O(n²) para almacenar el tablero
 */
@Service
public class WarnsdorffService {
    
    private static final int[] ROW_MOVES = {2, 1, -1, -2, -2, -1, 1, 2};
    private static final int[] COL_MOVES = {1, 2, 2, 1, -1, -2, -2, -1};
    
    private int stepsExplored;

    public SolutionResult solve(int boardSize, int startRow, int startCol) {
        long startTime = System.currentTimeMillis();
        stepsExplored = 0;
        
        int[][] board = new int[boardSize][boardSize];
        List<Position> path = new ArrayList<>();
        
        // Inicializar tablero con -1
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                board[i][j] = -1;
            }
        }
        
        // Comenzar desde la posición inicial
        board[startRow][startCol] = 0;
        path.add(new Position(startRow, startCol));
        
        boolean success = solveWithWarnsdorff(board, startRow, startCol, 1, boardSize, path);
        long executionTime = System.currentTimeMillis() - startTime;
        
        ComplexityAnalysis complexity = ComplexityAnalysis.builder()
            .timeComplexity("O(n²)")
            .spaceComplexity("O(n²)")
            .description("Usa la heurística de Warnsdorff: en cada paso, elige la casilla " +
                        "con menor número de movimientos disponibles. Mucho más eficiente que backtracking.")
            .build();
        
        return SolutionResult.builder()
            .success(success)
            .board(success ? board : null)
            .path(success ? new ArrayList<>(path) : null)
            .executionTimeMs(executionTime)
            .stepsExplored(stepsExplored)
            .algorithmName("Warnsdorff's Heuristic (Greedy)")
            .complexity(complexity)
            .alternativeSolutions(null)
            .message(success ? "Solución encontrada exitosamente con heurística greedy" : 
                    "No se pudo completar el recorrido con esta heurística")
            .build();
    }

    /**
     * Resuelve el Knight's Tour usando la heurística de Warnsdorff
     */
    private boolean solveWithWarnsdorff(int[][] board, int currentRow, int currentCol, 
                                        int moveCount, int boardSize, List<Position> path) {
        stepsExplored++;
        
        // Caso base: hemos visitado todas las casillas
        if (moveCount == boardSize * boardSize) {
            return true;
        }
        
        // Encontrar el mejor siguiente movimiento según Warnsdorff
        int bestRow = -1;
        int bestCol = -1;
        int minDegree = Integer.MAX_VALUE;
        
        // Evaluar todos los movimientos posibles
        for (int i = 0; i < 8; i++) {
            int nextRow = currentRow + ROW_MOVES[i];
            int nextCol = currentCol + COL_MOVES[i];
            
            if (isSafe(board, nextRow, nextCol, boardSize)) {
                // Calcular el grado de accesibilidad (número de movimientos disponibles desde esta casilla)
                int degree = getDegree(board, nextRow, nextCol, boardSize);
                
                // Elegir la casilla con menor grado (Warnsdorff's Rule)
                if (degree < minDegree) {
                    minDegree = degree;
                    bestRow = nextRow;
                    bestCol = nextCol;
                }
            }
        }
        
        // Si no hay movimiento válido, fallo
        if (bestRow == -1) {
            return false;
        }
        
        // Hacer el movimiento elegido
        board[bestRow][bestCol] = moveCount;
        path.add(new Position(bestRow, bestCol));
        
        // Continuar desde la nueva posición
        return solveWithWarnsdorff(board, bestRow, bestCol, moveCount + 1, boardSize, path);
    }

    /**
     * Calcula el grado de accesibilidad de una casilla
     * (cuántos movimientos válidos hay desde esa posición)
     */
    private int getDegree(int[][] board, int row, int col, int boardSize) {
        int count = 0;
        for (int i = 0; i < 8; i++) {
            int nextRow = row + ROW_MOVES[i];
            int nextCol = col + COL_MOVES[i];
            if (isSafe(board, nextRow, nextCol, boardSize)) {
                count++;
            }
        }
        return count;
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

