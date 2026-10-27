package com.student.management.dto;

public class StudentStatsResponse {
    private long totalStudents;
    private double averageMarks;
    private int highestMarks;
    private int lowestMarks;
    private long passedCount;
    private long failedCount;
    private double passPercentage;

    public StudentStatsResponse() {
    }

    public StudentStatsResponse(long totalStudents, double averageMarks, int highestMarks, int lowestMarks, long passedCount, long failedCount) {
        this.totalStudents = totalStudents;
        this.averageMarks = Math.round(averageMarks * 10.0) / 10.0;
        this.highestMarks = highestMarks;
        this.lowestMarks = lowestMarks;
        this.passedCount = passedCount;
        this.failedCount = failedCount;
        this.passPercentage = totalStudents > 0 ? Math.round(((double) passedCount / totalStudents * 100.0) * 10.0) / 10.0 : 0.0;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public double getAverageMarks() {
        return averageMarks;
    }

    public void setAverageMarks(double averageMarks) {
        this.averageMarks = averageMarks;
    }

    public int getHighestMarks() {
        return highestMarks;
    }

    public void setHighestMarks(int highestMarks) {
        this.highestMarks = highestMarks;
    }

    public int getLowestMarks() {
        return lowestMarks;
    }

    public void setLowestMarks(int lowestMarks) {
        this.lowestMarks = lowestMarks;
    }

    public long getPassedCount() {
        return passedCount;
    }

    public void setPassedCount(long passedCount) {
        this.passedCount = passedCount;
    }

    public long getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(long failedCount) {
        this.failedCount = failedCount;
    }

    public double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(double passPercentage) {
        this.passPercentage = passPercentage;
    }
}
