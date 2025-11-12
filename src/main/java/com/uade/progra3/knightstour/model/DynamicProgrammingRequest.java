package com.uade.progra3.knightstour.model;

public class DynamicProgrammingRequest {
    private int boardSize;
    private int startRow;
    private int startCol;
    private int maxMoves;
    private int[][] pointsBoard;

    public DynamicProgrammingRequest() {
    }

    public DynamicProgrammingRequest(int boardSize, int startRow, int startCol, int maxMoves, int[][] pointsBoard) {
        this.boardSize = boardSize;
        this.startRow = startRow;
        this.startCol = startCol;
        this.maxMoves = maxMoves;
        this.pointsBoard = pointsBoard;
    }

    public int getBoardSize() {
        return boardSize;
    }

    public void setBoardSize(int boardSize) {
        this.boardSize = boardSize;
    }

    public int getStartRow() {
        return startRow;
    }

    public void setStartRow(int startRow) {
        this.startRow = startRow;
    }

    public int getStartCol() {
        return startCol;
    }

    public void setStartCol(int startCol) {
        this.startCol = startCol;
    }

    public int getMaxMoves() {
        return maxMoves;
    }

    public void setMaxMoves(int maxMoves) {
        this.maxMoves = maxMoves;
    }

    public int[][] getPointsBoard() {
        return pointsBoard;
    }

    public void setPointsBoard(int[][] pointsBoard) {
        this.pointsBoard = pointsBoard;
    }
}
