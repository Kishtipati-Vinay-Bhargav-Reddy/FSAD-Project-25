package com.vinay.gradingsystem.controller;

import com.vinay.gradingsystem.model.Assignment;
import com.vinay.gradingsystem.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentService service;

    @PostMapping
    public Assignment create(@RequestBody Assignment assignment) {
        return service.createAssignment(assignment);
    }

    @GetMapping
    public List<Assignment> getAll() {
        return service.getAllAssignments();
    }
}