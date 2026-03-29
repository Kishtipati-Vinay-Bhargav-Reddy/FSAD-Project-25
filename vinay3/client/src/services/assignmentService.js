import api from "./api";

// CREATE ASSIGNMENT
export const createAssignment = async (assignment) => {
  try {
    const formattedDate = new Date(assignment.dueDate)
      .toISOString()
      .split("T")[0]; // fix date format

    const { data } = await api.post("/assignments", {
      title: assignment.title,
      description: assignment.description,
      dueDate: formattedDate,
    });

    return data;
  } catch (error) {
    console.error("CREATE ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// GET ALL ASSIGNMENTS
export const fetchAssignments = async () => {
  try {
    const { data } = await api.get("/assignments");
    return data;
  } catch (error) {
    console.error("FETCH ERROR:", error.response?.data || error.message);
    return [];
  }
};