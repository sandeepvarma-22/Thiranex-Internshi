import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/students';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const studentApi = {
  // Fetch all students with optional search & branch filter
  getAll: async (params = {}) => {
    const response = await apiClient.get('', { params });
    return response.data;
  },

  // Fetch single student by ID
  getById: async (id) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  // Search single student specifically by Roll Number
  getByRollNumber: async (rollNumber) => {
    const response = await apiClient.get('/search/roll', {
      params: { rollNumber: rollNumber.trim() },
    });
    return response.data;
  },

  // Fetch summary statistics
  getStats: async () => {
    const response = await apiClient.get('/stats');
    return response.data;
  },

  // Create new student record
  create: async (studentData) => {
    const response = await apiClient.post('', studentData);
    return response.data;
  },

  // Update existing student record
  update: async (id, studentData) => {
    const response = await apiClient.put(`/${id}`, studentData);
    return response.data;
  },

  // Delete student record
  delete: async (id) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },
};

// Helper to format backend errors into user-friendly messages and field error maps
export const extractErrorMessage = (error) => {
  if (error.response) {
    const data = error.response.data;
    const status = error.response.status;

    let fieldErrors = {};
    if (data.fieldErrors) {
      fieldErrors = data.fieldErrors;
    }

    let generalMessage = data.message || 'An error occurred while processing your request.';

    if (status === 409) {
      generalMessage = data.message || 'Duplicate Roll Number detected.';
    } else if (status === 404) {
      generalMessage = data.message || 'Student record not found.';
    } else if (status === 400 && Object.keys(fieldErrors).length > 0) {
      // Pick first field error if general message is generic
      generalMessage = Object.values(fieldErrors)[0];
    }

    return {
      status,
      message: generalMessage,
      fieldErrors,
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'Unable to connect to Spring Boot backend. Please ensure the backend is running on port 8080.',
      fieldErrors: {},
    };
  } else {
    return {
      status: -1,
      message: error.message || 'An unexpected error occurred.',
      fieldErrors: {},
    };
  }
};

export default studentApi;
