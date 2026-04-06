import api from "./api";

// CREATE ASSIGNMENT
export const createAssignment = async (assignment) => {
  try {
    const formattedDate = assignment.dueDate?.trim();
    if (!formattedDate) {
      throw new Error("Assignment deadline missing");
    }

    const { data } = await api.post("/assignments", {
      title: assignment.title,
      description: assignment.description,
      dueDate: formattedDate,
      courseCode: assignment.courseCode,
      courseName: assignment.courseName,
    });

    return data;
  } catch (error) {
    console.error("CREATE ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// GET ALL ASSIGNMENTS
export const fetchAssignments = async (courseCode) => {
  try {
    const requestConfig = courseCode
      ? { params: { courseCode } }
      : undefined;

    const { data } = await api.get("/assignments", requestConfig);
    return data;
  } catch (error) {
    console.error("FETCH ERROR:", error.response?.data || error.message);
    return [];
  }
};

export const fetchCourses = async () => {
  try {
    const { data } = await api.get("/assignments/courses");
    return data;
  } catch (error) {
    console.error("COURSE FETCH ERROR:", error.response?.data || error.message);
    return [];
  }
};

export const createCourse = async (course) => {
  try {
    const { data } = await api.post("/assignments/courses", {
      code: course.code?.trim()?.toUpperCase(),
      name: course.name?.trim(),
      department: course.department?.trim(),
      term: course.term?.trim(),
    });

    return data;
  } catch (error) {
    console.error("COURSE CREATE ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const removeCourse = async (courseCode) => {
  try {
    const { data } = await api.put(
      `/assignments/courses/${encodeURIComponent(courseCode)}/remove`
    );

    return data;
  } catch (error) {
    console.error("COURSE REMOVE ERROR:", error.response?.data || error.message);
    throw error;
  }
};
