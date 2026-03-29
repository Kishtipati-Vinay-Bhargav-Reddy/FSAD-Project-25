package com.vinay.gradingsystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vinay.gradingsystem.model.Student;
import com.vinay.gradingsystem.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repo;

    // ✅ REGISTER
    public Student register(Student student) {

        if (student.getName() == null || student.getName().isEmpty())
            throw new RuntimeException("Name required");

        if (student.getEmail() == null || student.getEmail().isEmpty())
            throw new RuntimeException("Email required");

        if (student.getPassword() == null || student.getPassword().isEmpty())
            throw new RuntimeException("Password required");

        if (repo.findByEmail(student.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        if (student.getRole() == null)
            student.setRole("student");

        return repo.save(student);
    }

    // ✅ LOGIN
    public Student login(String email, String password) {

        Student user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password))
            throw new RuntimeException("Invalid password");

        return user;
    }

    // ✅ PROFILE
    public Student getProfile() {
        List<Student> list = repo.findAll();

        if (list.isEmpty())
            throw new RuntimeException("No user found");

        return list.get(list.size() - 1);
    }
}