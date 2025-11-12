package com.uade.progra3.knightstour.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplexityAnalysis {
    private String timeComplexity;
    private String spaceComplexity;
    private String description;
}

