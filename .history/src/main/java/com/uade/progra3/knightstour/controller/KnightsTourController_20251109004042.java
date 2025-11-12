package com.uade.progra3.knightstour.controller;

import com.uade.progra3.knightstour.model.DynamicProgrammingRequest;
import com.uade.progra3.knightstour.model.SolutionResult;
import com.uade.progra3.knightstour.service.BacktrackingService;
import com.uade.progra3.knightstour.service.DynamicProgrammingService;
import com.uade.progra3.knightstour.service.WarnsdorffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller para exponer los diferentes algoritmos del Knight's Tour
 */
@RestController
@RequestMapping("/api/knights-tour")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KnightsTourController {

    private final BacktrackingService backtrackingService;
    private final WarnsdorffService warnsdorffService;
    private final DynamicProgrammingService dynamicProgrammingService;

    /**
     * Resuelve el Knight's Tour usando Backtracking
     * 
     * @param boardSize Tamaño del tablero (n x n)
     * @param startRow Fila inicial (0-indexed)
     * @param startCol Columna inicial (0-indexed)
     */
    @GetMapping("/backtracking")
    public ResponseEntity<SolutionResult> solveWithBacktracking(
            @RequestParam(defaultValue = "5") int boardSize,
            @RequestParam(defaultValue = "0") int startRow,
            @RequestParam(defaultValue = "0") int startCol) {
        
        if (boardSize < 1 || boardSize > 8) {
            return ResponseEntity.badRequest().build();
        }
        
        if (startRow < 0 || startRow >= boardSize || startCol < 0 || startCol >= boardSize) {
            return ResponseEntity.badRequest().build();
        }
        
        SolutionResult result = backtrackingService.solve(boardSize, startRow, startCol);
        return ResponseEntity.ok(result);
    }

    /**
     * Resuelve el Knight's Tour usando la Heurística de Warnsdorff
     * 
     * @param boardSize Tamaño del tablero (n x n)
     * @param startRow Fila inicial (0-indexed)
     * @param startCol Columna inicial (0-indexed)
     */
    @GetMapping("/warnsdorff")
    public ResponseEntity<SolutionResult> solveWithWarnsdorff(
            @RequestParam(defaultValue = "8") int boardSize,
            @RequestParam(defaultValue = "0") int startRow,
            @RequestParam(defaultValue = "0") int startCol) {
        
        if (boardSize < 1 || boardSize > 20) {
            return ResponseEntity.badRequest().build();
        }
        
        if (startRow < 0 || startRow >= boardSize || startCol < 0 || startCol >= boardSize) {
            return ResponseEntity.badRequest().build();
        }
        
        SolutionResult result = warnsdorffService.solve(boardSize, startRow, startCol);
        return ResponseEntity.ok(result);
    }

    /**
     * Resuelve el problema de maximización de puntos usando Programación Dinámica
     */
    @PostMapping("/dynamic-programming")
    public ResponseEntity<SolutionResult> solveWithDynamicProgramming(
            @RequestBody DynamicProgrammingRequest request) {
        
        int boardSize = request.getBoardSize();
        int[][] pointsBoard = request.getPointsBoard();
        
        // Si no se proporciona tablero de puntos, generar uno aleatorio
        if (pointsBoard == null || pointsBoard.length == 0) {
            pointsBoard = dynamicProgrammingService.generateRandomPointsBoard(boardSize);
        }
        
        SolutionResult result = dynamicProgrammingService.solve(
            boardSize,
            request.getStartRow(),
            request.getStartCol(),
            request.getMaxMoves(),
            pointsBoard
        );
        
        return ResponseEntity.ok(result);
    }

    /**
     * Genera un tablero aleatorio con puntos para el problema de PD
     */
    @GetMapping("/generate-points-board")
    public ResponseEntity<int[][]> generatePointsBoard(
            @RequestParam(defaultValue = "8") int boardSize) {
        
        if (boardSize < 1 || boardSize > 20) {
            return ResponseEntity.badRequest().build();
        }
        
        int[][] board = dynamicProgrammingService.generateRandomPointsBoard(boardSize);
        return ResponseEntity.ok(board);
    }

    /**
     * Compara los tres algoritmos en un tablero específico
     */
    @GetMapping("/compare")
    public ResponseEntity<ComparisonResult> compareAlgorithms(
            @RequestParam(defaultValue = "6") int boardSize,
            @RequestParam(defaultValue = "0") int startRow,
            @RequestParam(defaultValue = "0") int startCol) {
        
        if (boardSize < 1 || boardSize > 8) {
            return ResponseEntity.badRequest().build();
        }
        
        // Ejecutar ambos algoritmos (solo backtracking y warnsdorff son comparables)
        SolutionResult backtracking = backtrackingService.solve(boardSize, startRow, startCol);
        SolutionResult warnsdorff = warnsdorffService.solve(boardSize, startRow, startCol);
        
        ComparisonResult comparison = ComparisonResult.builder()
            .backtracking(backtracking)
            .warnsdorff(warnsdorff)
            .build();
        
        return ResponseEntity.ok(comparison);
    }

    @lombok.Data
    @lombok.Builder
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class ComparisonResult {
        private SolutionResult backtracking;
        private SolutionResult warnsdorff;
    }
}

