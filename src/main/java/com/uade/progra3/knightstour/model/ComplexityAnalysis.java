package com.uade.progra3.knightstour.model;

public class ComplexityAnalysis {
    private String timeComplexity;
    private String spaceComplexity;
    private String description;

    public ComplexityAnalysis() {
    }

    public ComplexityAnalysis(String timeComplexity, String spaceComplexity, String description) {
        this.timeComplexity = timeComplexity;
        this.spaceComplexity = spaceComplexity;
        this.description = description;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getTimeComplexity() {
        return timeComplexity;
    }

    public void setTimeComplexity(String timeComplexity) {
        this.timeComplexity = timeComplexity;
    }

    public String getSpaceComplexity() {
        return spaceComplexity;
    }

    public void setSpaceComplexity(String spaceComplexity) {
        this.spaceComplexity = spaceComplexity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static class Builder {
        private String timeComplexity;
        private String spaceComplexity;
        private String description;

        public Builder timeComplexity(String timeComplexity) {
            this.timeComplexity = timeComplexity;
            return this;
        }

        public Builder spaceComplexity(String spaceComplexity) {
            this.spaceComplexity = spaceComplexity;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public ComplexityAnalysis build() {
            return new ComplexityAnalysis(timeComplexity, spaceComplexity, description);
        }
    }
}
