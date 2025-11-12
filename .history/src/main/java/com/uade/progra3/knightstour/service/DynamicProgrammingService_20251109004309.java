package com.uade.progra3.knightstour.service;

import com.uade.progra3.knightstour.model.ComplexityAnalysis;
import com.uade.progra3.knightstour.model.Position;
import com.uade.progra3.knightstour.model.SolutionResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación con Programación Dinámica para maximizar puntos.
 * 
 * Problema: Dado un tablero con casillas con puntaje, el caballo debe maximizar
 * la suma de puntos visitados en exactamente K movimientos.
 * 
 * Enfoque: Usamos memoización con una tabla 3D:
 * dp[row][col][moves] = máximo puntaje alcanzable desde (row, col) con 'moves' movimientos restantes
 * 
 * Complejidad:
 * - Tiempo: O(n² * k * 8) = O(n² * k) donde n es el tamaño del tablero y k el número de movimientos
 * - Espacio: O(n² * k) para la tabla de memoización
 */
@Service
public class DynamicProgrammingService {
    
    private static final int[] ROW_MOVES = {2, 1, -1, -2, -2, -1, 1, 2};
    private static final int[] COL_MOVES = {1, 2, 2, 1, -1, -2, -2, -1};
    
    private int[][][] memo;
    private int[][] pointsBoard;
    private int boardSize;
    private int stepsExplored;
    private List<Position> bestPath;

    public SolutionResult solve(int boardSize, int startRow, int startCol, 
                                int maxMoves, int[][] pointsBoard) {
        long startTime = System.currentTimeMillis();
        stepsExplored = 0;
        this.boardSize = boardSize;
        this.pointsBoard = pointsBoard;
        this.bestPath = new ArrayList<>();
        
        // Inicializar tabla de memoización
        // memo[row][col][movesLeft] = máximo puntaje desde (row, col) con movesLeft movimientos
        memo = new int[boardSize][boardSize][maxMoves + 1];
        
        // Inicializar con -1 (no calculado)
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                for (int k = 0; k <= maxMoves; k++) {
                    memo[i][j][k] = -1;
                }
            }
        }
        
        // Calcular el máximo puntaje posible
        int maxScore = solveDP(startRow, startCol, maxMoves);
        
        // Reconstruir el camino óptimo
        reconstructPath(startRow, startCol, maxMoves);
        
        // Crear tablero de visualización con el orden de visitas
        int[][] board = new int[boardSize][boardSize];
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                board[i][j] = -1;
            }
        }
        
        for (int i = 0; i < bestPath.size(); i++) {
            Position pos = bestPath.get(i);
            board[pos.getRow()][pos.getCol()] = i;
        }
        
        long executionTime = System.currentTimeMillis() - startTime;
        
        ComplexityAnalysis complexity = ComplexityAnalysis.builder()
            .timeComplexity("O(n² * k)")
            .spaceComplexity("O(n² * k)")
            .description("Usa programación dinámica con memoización para maximizar puntos " +
                        "en k movimientos. Evita recalcular subproblemas ya resueltos.")
            .build();
        
        return SolutionResult.builder()
            .success(true)
            .board(board)
            .path(new ArrayList<>(bestPath))
            .executionTimeMs(executionTime)
            .stepsExplored(stepsExplored)
            .algorithmName("Dynamic Programming (Max Points)")
            .complexity(complexity)
            .message(String.format("Puntaje máximo alcanzado: %d puntos en %d movimientos", 
                                  maxScore, maxMoves))
            .build();
    }

    /**
     * Función recursiva con memoización para calcular el máximo puntaje
     */
    private int solveDP(int row, int col, int movesLeft) {
        stepsExplored++;
        
        // Caso base: no quedan más movimientos
        if (movesLeft == 0) {
            return pointsBoard[row][col];
        }
        
        // Si ya lo calculamos, retornar el valor memoizado
        if (memo[row][col][movesLeft] != -1) {
            return memo[row][col][movesLeft];
        }
        
        // Puntos de la casilla actual
        int currentPoints = pointsBoard[row][col];
        int maxFuturePoints = 0;
        
        // Probar todos los movimientos posibles
        for (int i = 0; i < 8; i++) {
            int nextRow = row + ROW_MOVES[i];
            int nextCol = col + COL_MOVES[i];
            
            if (isValid(nextRow, nextCol)) {
                int futurePoints = solveDP(nextRow, nextCol, movesLeft - 1);
                maxFuturePoints = Math.max(maxFuturePoints, futurePoints);
            }
        }
        
        // Memoizar y retornar
        memo[row][col][movesLeft] = currentPoints + maxFuturePoints;
        return memo[row][col][movesLeft];
    }

    /**
     * Reconstruye el camino óptimo siguiendo la tabla de memoización
     */
    private void reconstructPath(int startRow, int startCol, int maxMoves) {
        bestPath.clear();
        int row = startRow;
        int col = startCol;
        int movesLeft = maxMoves;
        
        bestPath.add(new Position(row, col));
        
        while (movesLeft > 0) {
            int bestRow = -1;
            int bestCol = -1;
            int bestValue = -1;
            
            // Encontrar el mejor siguiente movimiento
            for (int i = 0; i < 8; i++) {
                int nextRow = row + ROW_MOVES[i];
                int nextCol = col + COL_MOVES[i];
                
                if (isValid(nextRow, nextCol)) {
                    int value = memo[nextRow][nextCol][movesLeft - 1];
                    if (value > bestValue) {
                        bestValue = value;
                        bestRow = nextRow;
                        bestCol = nextCol;
                    }
                }
            }
            
            if (bestRow == -1) break;
            
            bestPath.add(new Position(bestRow, bestCol));
            row = bestRow;
            col = bestCol;
            movesLeft--;
        }
    }

    /**
     * Verifica si una posición está dentro del tablero
     */
    private boolean isValid(int row, int col) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    }

    /**
     * Genera un tablero aleatorio con puntos para demostración
     */
    public int[][] generateRandomPointsBoard(int size) {
        int[][] board = new int[size][size];
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                board[i][j] = (int) (Math.random() * 10) + 1; // Puntos entre 1 y 10
            }
        }
        return board;
    }
}

