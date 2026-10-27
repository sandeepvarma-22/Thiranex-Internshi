package com.student.management.service;

import com.student.management.dto.StudentStatsResponse;
import com.student.management.exception.DuplicateRollNumberException;
import com.student.management.exception.ResourceNotFoundException;
import com.student.management.model.Student;
import com.student.management.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public List<Student> getAllStudents(String search, String branch) {
        if (search != null && !search.trim().isEmpty()) {
            return studentRepository.searchStudents(search.trim());
        }
        if (branch != null && !branch.trim().isEmpty() && !branch.equalsIgnoreCase("ALL")) {
            return studentRepository.findByBranchIgnoreCase(branch.trim());
        }
        return studentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Student getStudentByRollNumber(String rollNumber) {
        if (rollNumber == null || rollNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Roll number cannot be empty");
        }
        return studentRepository.findByRollNumberIgnoreCase(rollNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("No student found with Roll Number: " + rollNumber));
    }

    public Student createStudent(Student student) {
        validateStudentData(student);

        String normalizedRoll = student.getRollNumber().trim().toUpperCase();
        if (studentRepository.existsByRollNumberIgnoreCase(normalizedRoll)) {
            throw new DuplicateRollNumberException("Student with Roll Number '" + normalizedRoll + "' already exists.");
        }

        student.setRollNumber(normalizedRoll);
        student.setName(student.getName().trim());
        student.setBranch(student.getBranch().trim());

        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student updatedDetails) {
        Student existingStudent = getStudentById(id);

        validateStudentData(updatedDetails);

        String normalizedRoll = updatedDetails.getRollNumber().trim().toUpperCase();
        if (studentRepository.existsByRollNumberIgnoreCaseAndIdNot(normalizedRoll, id)) {
            throw new DuplicateRollNumberException("Roll Number '" + normalizedRoll + "' is already assigned to another student.");
        }

        existingStudent.setName(updatedDetails.getName().trim());
        existingStudent.setRollNumber(normalizedRoll);
        existingStudent.setBranch(updatedDetails.getBranch().trim());
        existingStudent.setMarks(updatedDetails.getMarks());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        Student existingStudent = getStudentById(id);
        studentRepository.delete(existingStudent);
    }

    @Transactional(readOnly = true)
    public StudentStatsResponse getStatistics() {
        long total = studentRepository.count();
        if (total == 0) {
            return new StudentStatsResponse(0, 0.0, 0, 0, 0, 0);
        }

        Double avg = studentRepository.calculateAverageMarks();
        Integer max = studentRepository.findHighestMarks();
        Integer min = studentRepository.findLowestMarks();
        Long passed = studentRepository.countPassedStudents();
        Long failed = studentRepository.countFailedStudents();

        return new StudentStatsResponse(
                total,
                avg != null ? avg : 0.0,
                max != null ? max : 0,
                min != null ? min : 0,
                passed != null ? passed : 0,
                failed != null ? failed : 0
        );
    }

    private void validateStudentData(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student data is required");
        }
        if (student.getName() == null || student.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Student name is required");
        }
        if (student.getRollNumber() == null || student.getRollNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Roll number is required");
        }
        if (student.getBranch() == null || student.getBranch().trim().isEmpty()) {
            throw new IllegalArgumentException("Branch is required");
        }
        if (student.getMarks() == null) {
            throw new IllegalArgumentException("Marks are required");
        }
        if (student.getMarks() < 0 || student.getMarks() > 100) {
            throw new IllegalArgumentException("Marks must be between 0 and 100. Entered: " + student.getMarks());
        }
    }
}
