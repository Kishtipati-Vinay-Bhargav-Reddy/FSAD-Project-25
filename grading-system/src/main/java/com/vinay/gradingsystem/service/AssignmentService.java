package com.vinay.gradingsystem.service;

import com.vinay.gradingsystem.model.Assignment;
import com.vinay.gradingsystem.model.Course;
import com.vinay.gradingsystem.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class AssignmentService {

    private static final String UNASSIGNED_COURSE_CODE = "UNASSIGNED";
    private static final String UNASSIGNED_COURSE_NAME = "Course Not Assigned";

    @Autowired
    private AssignmentRepository repo;

    @Autowired
    private CourseService courseService;

    public Assignment createAssignment(Assignment assignment) {
        String normalizedCourseCode = normalizeCourseCode(assignment.getCourseCode());
        String normalizedDueDate = normalizeDueDate(assignment.getDueDate());

        if (normalizedDueDate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment deadline is required.");
        }

        assignment.setDueDate(normalizedDueDate);

        if (normalizedCourseCode == null) {
            assignment.setCourseCode(UNASSIGNED_COURSE_CODE);
            assignment.setCourseName(UNASSIGNED_COURSE_NAME);
        } else {
            Optional<Course> selectedCourse = courseService.findActiveByCode(normalizedCourseCode);

            if (selectedCourse.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected course does not exist or was removed.");
            }

            assignment.setCourseCode(normalizedCourseCode);
            assignment.setCourseName(selectedCourse
                    .map(Course::getName)
                    .orElseGet(() -> hasText(assignment.getCourseName()) ? assignment.getCourseName().trim() : UNASSIGNED_COURSE_NAME));
        }

        return repo.save(assignment);
    }

    public List<Assignment> getAllAssignments(String courseCode) {
        String normalizedCourseCode = normalizeCourseCode(courseCode);

        if (normalizedCourseCode == null) {
            return repo.findAllByOrderByDueDateAsc();
        }

        return repo.findByCourseCodeIgnoreCaseOrderByDueDateAsc(normalizedCourseCode);
    }

    private String normalizeCourseCode(String courseCode) {
        if (!hasText(courseCode)) {
            return null;
        }

        return courseCode.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeDueDate(String dueDate) {
        if (!hasText(dueDate)) {
            return null;
        }

        return dueDate.trim();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
