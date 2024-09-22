import axiosInstance from './AxiosInstance';

  export const GetAllAdmins = async () => {
    try {
      const response = await axiosInstance.get('/admin');
      // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
      return response.data; 
    } catch (error) {
      handleErrorResponse(error);
      throw error;
    }
  };
  
  export const GetSingleAdmin = async (admin_id) => {
    try {
      const response = await axiosInstance.get(`/admin/${admin_id}`);
      // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
      return response.data;
    } catch (error) {
      handleErrorResponse(error);
      throw error;
    }
  };
  
  export const CreateAdmin = async (adminData) => {
    // console.log(`Data: ${JSON.stringify(adminData, null, 2)}`);
    try {
      const response = await axiosInstance.post('/admin', adminData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
      return response.data;
    } catch (error) {
      handleErrorResponse(error);
      throw error;
    }
  };
  
  export const UpdateAdmin = async (adminId, adminData) => {
    // console.log(`Updating admin ${adminId} with data: ${JSON.stringify(adminData, null, 2)}`);
    try {
      const response = await axiosInstance.put(`/admin/${adminId}`, adminData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
      return response.data;
    } catch (error) {
      handleErrorResponse(error);
      throw error;
    }
  };
  
  export const DeleteAdmin = async (admin_id) => {
    try {
      const response = await axiosInstance.delete(`/admin/${admin_id}`);
      // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
      return response.data;
    } catch (error) {
      handleErrorResponse(error);
      throw error;
    }
  };
  
  const handleErrorResponse = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`Error Status: ${status}`);
      console.error(`Error Data: ${JSON.stringify(data, null, 2)}`);
      
      switch (status) {
        case 400:
          console.error("Bad Request: The request could not be understood or was missing required parameters.");
          break;
        case 401:
          console.error("Unauthorized: Authentication failed or user does not have permissions for the requested operation.");
          break;
        case 403:
          console.error("Forbidden: Authentication succeeded but authenticated user does not have access to the resource.");
          break;
        case 404:
          console.error("Not Found: The requested resource could not be found.");
          break;
        case 500:
          console.error("Internal Server Error: An error occurred on the server.");
          break;
        default:
          console.error("An unexpected error occurred.");
      }
    } else if (error.request) {
      console.error("No response received from the server. Please check your network connection.");
    } else {
      console.error("Error setting up the request:", error.message);
    }
  };