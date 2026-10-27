package com.student.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students", uniqueConstraints = {
    @UniqueConstraint(columnNames = "roll_number")
})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name cannot be empty")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Roll number cannot be empty")
    @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "Roll number can only contain alphanumeric characters, hyphens, and underscores")
    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @NotBlank(message = "Branch is required")
    @Column(nullable = false)
    private String branch;

    @NotNull(message = "Marks are required")
    @Min(value = 0, message = "Marks must be at least 0")
    @Max(value = 100, message = "Marks cannot exceed 100")
    @Column(nullable = false)
    private Integer marks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Student() {
    }

    public Student(String name, String rollNumber, String branch, Integer marks) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.marks = marks;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.rollNumber != null) {
            this.rollNumber = this.rollNumber.trim().toUpperCase();
        }
        if (this.name != null) {
            this.name = this.name.trim();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.rollNumber != null) {
            this.rollNumber = this.rollNumber.trim().toUpperCase();
        }
        if (this.name != null) {
            this.name = this.name.trim();
        }
    }

    // Helper method for grade calculation
    public String getGrade() {
        if (marks == null) return "N/A";
        if (marks >= 90) return "A+";
        if (marks >= 80) return "A";
        if (marks >= 70) return "B";
        if (marks >= 60) return "C";
        if (marks >= 50) return "D";
        if (marks >= 40) return "E";
        return "F";
    }

    public boolean isPassed() {
        return marks != null && marks >= 40;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
