package com.uade.progra3.knightstour.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SolutionResult {
    private boolean success;
    private int[][] board;
    private List<Position> path;
    private long executionTimeMs;
    private int stepsExplored;
    private String algorithmName;
    private ComplexityAnalysis complexity;
    private String message;
}

