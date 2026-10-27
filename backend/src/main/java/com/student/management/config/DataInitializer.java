package com.student.management.config;

import com.student.management.model.Student;
import com.student.management.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StudentRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<Student> sampleStudents = List.of(
                        new Student("Aarav Sharma", "CS101", "Computer Science", 92),
                        new Student("Priya Patel", "IT102", "Information Technology", 85),
                        new Student("Rohan Verma", "EC103", "Electronics & Comm", 74),
                        new Student("Sneha Reddy", "ME104", "Mechanical Eng", 68),
                        new Student("Vikram Singh", "CE105", "Civil Engineering", 58),
                        new Student("Ananya Iyer", "CS106", "Computer Science", 96),
                        new Student("Mohammed Faizan", "IT107", "Information Technology", 35)
                );

                repository.saveAll(sampleStudents);
                System.out.println(">>> Sample student records successfully initialized in H2 database!");
            }
        };
    }
}
