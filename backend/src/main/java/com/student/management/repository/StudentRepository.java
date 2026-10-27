package com.student.management.repository;

import com.student.management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumberIgnoreCase(String rollNumber);

    boolean existsByRollNumberIgnoreCase(String rollNumber);

    boolean existsByRollNumberIgnoreCaseAndIdNot(String rollNumber, Long id);

    List<Student> findByRollNumberContainingIgnoreCase(String rollNumber);

    List<Student> findByNameContainingIgnoreCase(String name);

    List<Student> findByBranchIgnoreCase(String branch);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.branch) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Student> searchStudents(String query);

    @Query("SELECT AVG(s.marks) FROM Student s")
    Double calculateAverageMarks();

    @Query("SELECT MAX(s.marks) FROM Student s")
    Integer findHighestMarks();

    @Query("SELECT MIN(s.marks) FROM Student s")
    Integer findLowestMarks();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.marks >= 40")
    Long countPassedStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.marks < 40")
    Long countFailedStudents();
}
