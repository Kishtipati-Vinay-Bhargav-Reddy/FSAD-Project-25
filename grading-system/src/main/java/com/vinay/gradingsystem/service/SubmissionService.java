package com.vinay.gradingsystem.service;

import com.vinay.gradingsystem.model.Submission;
import com.vinay.gradingsystem.repository.SubmissionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.io.IOException;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository repo;

    // ✅ NORMAL SUBMIT
    public Submission submit(Submission submission) {

        if (submission.getStudentName() == null || submission.getStudentName().isEmpty()) {
            throw new RuntimeException("Student name required");
        }

        if (submission.getAssignmentId() == null) {
            throw new RuntimeException("Assignment ID required");
        }

        submission.setStatus("PENDING");

        return repo.save(submission);
    }

    // ✅ FILE UPLOAD (FIXED 🔥)
    public Submission saveFile(MultipartFile file, Long assignmentId, String studentName) {

        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            if (assignmentId == null) {
                throw new RuntimeException("Assignment ID required");
            }

            if (studentName == null || studentName.isEmpty()) {
                throw new RuntimeException("Student name required");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Submission submission = new Submission();
            submission.setAssignmentId(assignmentId);
            submission.setStudentName(studentName);
            submission.setFileName(fileName);
            submission.setStatus("PENDING");

            return repo.save(submission);

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("File upload failed");
        }
    }

    // ✅ GET BY ASSIGNMENT
    public List<Submission> getByAssignment(Long assignmentId) {
        return repo.findByAssignmentId(assignmentId);
    }

    // ✅ GET ALL
    public List<Submission> getAllSubmissions() {
        return repo.findAll();
    }

    // ✅ GRADE
    public Submission gradeSubmission(Long id, Integer grade, String feedback) {
        Submission s = repo.findById(id).orElseThrow();

        s.setGrade(grade);
        s.setFeedback(feedback);
        s.setStatus("GRADED");

        return repo.save(s);
    }
}