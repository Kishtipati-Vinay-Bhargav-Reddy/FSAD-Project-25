package com.vinay.gradingsystem.repository;

import com.vinay.gradingsystem.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findAllByOrderByDueDateAsc();
    List<Assignment> findByCourseCodeIgnoreCaseOrderByDueDateAsc(String courseCode);
}
