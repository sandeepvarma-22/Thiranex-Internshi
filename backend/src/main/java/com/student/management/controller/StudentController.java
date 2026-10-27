package com.student.management.controller;

import com.student.management.dto.StudentStatsResponse;
import com.student.management.model.Student;
import com.student.management.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String branch) {
        List<Student> students = studentService.getAllStudents(search, branch);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/search/roll")
    public ResponseEntity<Student> getStudentByRollNumber(@RequestParam String rollNumber) {
        Student student = studentService.getStudentByRollNumber(rollNumber);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/stats")
    public ResponseEntity<StudentStatsResponse> getStudentStats() {
        StudentStatsResponse stats = studentService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<Student> addStudent(@Valid @RequestBody Student student) {
        Student created = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student student) {
        Student updated = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Student record successfully deleted");
        response.put("deletedId", id);
        return ResponseEntity.ok(response);
    }
}
