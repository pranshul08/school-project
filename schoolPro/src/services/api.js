// API service module for school management
const API_BASE_URL = "http://localhost:5000/api";

// Generic fetch wrapper with error handling
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API request failed:", error);
    return { success: false, error: error.message };
  }
};

// School API functions
export const schoolAPI = {
  // Get all schools with pagination and search
  getAllSchools: async (page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return await apiRequest(`${API_BASE_URL}/schools?${params}`);
  },

  // Get school by ID
  getSchoolById: async (id) => {
    return await apiRequest(`${API_BASE_URL}/schools/${id}`);
  },

  // Create new school with FormData (includes image)
  createSchool: async (schoolData, imageFile = null) => {
    const formData = new FormData();

    // Add all school data to FormData
    Object.keys(schoolData).forEach((key) => {
      if (schoolData[key] !== null && schoolData[key] !== undefined) {
        formData.append(key, schoolData[key]);
      }
    });

    // Add image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/schools`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Create school failed:", error);
      return { success: false, error: error.message };
    }
  },

  // Update school
  updateSchool: async (id, schoolData) => {
    return await apiRequest(`${API_BASE_URL}/schools/${id}`, {
      method: "PUT",
      body: JSON.stringify(schoolData),
    });
  },

  // Delete school
  deleteSchool: async (id) => {
    return await apiRequest(`${API_BASE_URL}/schools/${id}`, {
      method: "DELETE",
    });
  },
};

export default schoolAPI;
