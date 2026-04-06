package com.vinay.gradingsystem.controller;

import com.vinay.gradingsystem.model.Assignment;
import com.vinay.gradingsystem.model.Course;
import com.vinay.gradingsystem.service.AssignmentService;
import com.vinay.gradingsystem.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentService service;

    @Autowired
    private CourseService courseService;

    @PostMapping
    public Assignment create(@RequestBody Assignment assignment) {
        return service.createAssignment(assignment);
    }

    @GetMapping
    public List<Assignment> getAll(@RequestParam(required = false) String courseCode) {
        return service.getAllAssignments(courseCode);
    }

    @GetMapping("/courses")
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/courses")
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @PutMapping("/courses/{code}/remove")
    public Course removeCourse(@PathVariable String code) {
        return courseService.removeCourse(code);
    }
}
