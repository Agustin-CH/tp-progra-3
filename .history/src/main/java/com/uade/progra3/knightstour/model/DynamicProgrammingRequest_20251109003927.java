package com.uade.progra3.knightstour.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DynamicProgrammingRequest {
    private int boardSize;
    private int startRow;
    private int startCol;
    private int maxMoves;
    private int[][] pointsBoard;
}

