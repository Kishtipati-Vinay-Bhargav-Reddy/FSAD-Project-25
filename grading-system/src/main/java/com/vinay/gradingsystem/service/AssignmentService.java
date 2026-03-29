package com.vinay.gradingsystem.service;

import com.vinay.gradingsystem.model.Assignment;
import com.vinay.gradingsystem.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository repo;

    public Assignment createAssignment(Assignment assignment) {
        return repo.save(assignment);
    }

    public List<Assignment> getAllAssignments() {
        return repo.findAll();
    }
}