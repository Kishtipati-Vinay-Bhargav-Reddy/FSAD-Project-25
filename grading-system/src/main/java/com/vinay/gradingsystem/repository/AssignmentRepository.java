package com.vinay.gradingsystem.repository;

import com.vinay.gradingsystem.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}