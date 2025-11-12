package com.uade.progra3.knightstour.model;

import java.util.List;

public class SolutionResult {
    private boolean success;
    private int[][] board;
    private List<Position> path;
    private long executionTimeMs;
    private int stepsExplored;
    private String algorithmName;
    private ComplexityAnalysis complexity;
    private String message;
    private List<int[][]> alternativeSolutions;  // Soluciones alternativas

    public SolutionResult() {
    }

    public SolutionResult(boolean success, int[][] board, List<Position> path, long executionTimeMs,
                          int stepsExplored, String algorithmName, ComplexityAnalysis complexity, String message,
                          List<int[][]> alternativeSolutions) {
        this.success = success;
        this.board = board;
        this.path = path;
        this.executionTimeMs = executionTimeMs;
        this.stepsExplored = stepsExplored;
        this.algorithmName = algorithmName;
        this.complexity = complexity;
        this.message = message;
        this.alternativeSolutions = alternativeSolutions;
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int[][] getBoard() {
        return board;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }

    public List<Position> getPath() {
        return path;
    }

    public void setPath(List<Position> path) {
        this.path = path;
    }

    public long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public int getStepsExplored() {
        return stepsExplored;
    }

    public void setStepsExplored(int stepsExplored) {
        this.stepsExplored = stepsExplored;
    }

    public String getAlgorithmName() {
        return algorithmName;
    }

    public void setAlgorithmName(String algorithmName) {
        this.algorithmName = algorithmName;
    }

    public ComplexityAnalysis getComplexity() {
        return complexity;
    }

    public void setComplexity(ComplexityAnalysis complexity) {
        this.complexity = complexity;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<int[][]> getAlternativeSolutions() {
        return alternativeSolutions;
    }

    public void setAlternativeSolutions(List<int[][]> alternativeSolutions) {
        this.alternativeSolutions = alternativeSolutions;
    }

    public static class Builder {
        private boolean success;
        private int[][] board;
        private List<Position> path;
        private long executionTimeMs;
        private int stepsExplored;
        private String algorithmName;
        private ComplexityAnalysis complexity;
        private String message;
        private List<int[][]> alternativeSolutions;

        public Builder success(boolean success) {
            this.success = success;
            return this;
        }

        public Builder board(int[][] board) {
            this.board = board;
            return this;
        }

        public Builder path(List<Position> path) {
            this.path = path;
            return this;
        }

        public Builder executionTimeMs(long executionTimeMs) {
            this.executionTimeMs = executionTimeMs;
            return this;
        }

        public Builder stepsExplored(int stepsExplored) {
            this.stepsExplored = stepsExplored;
            return this;
        }

        public Builder algorithmName(String algorithmName) {
            this.algorithmName = algorithmName;
            return this;
        }

        public Builder complexity(ComplexityAnalysis complexity) {
            this.complexity = complexity;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder alternativeSolutions(List<int[][]> alternativeSolutions) {
            this.alternativeSolutions = alternativeSolutions;
            return this;
        }

        public SolutionResult build() {
            return new SolutionResult(success, board, path, executionTimeMs, stepsExplored,
                                     algorithmName, complexity, message, alternativeSolutions);
        }
    }
}
