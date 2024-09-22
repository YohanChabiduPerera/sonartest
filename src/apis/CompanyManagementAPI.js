import axiosInstance from './AxiosInstance';

  export const GetAllCompanys = async () => {
    try {
      const response = await axiosInstance.get('/superAdmin/company');
      // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
      return response.data; 
    } catch (error) {
      handleErrorResponse(error);
      throw error;
    }
  };
  
  export const GetSingleCompany = async (company_id) => {
    try {
      const response = await axiosInstance.get(`/superAdmin/company/${company_id}`);
      // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
      return response.data;
    } catch (error) {
      handleErrorResponse(error);
      throw error;
    }
  };
  
  export const CreateCompany = async (companyData) => {
    // console.log(`Data: ${JSON.stringify(companyData, null, 2)}`);
    try {
      const response = await axiosInstance.post('/superAdmin/company', companyData, {
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
  
  export const UpdateCompany = async (companyId, companyData) => {
    // console.log(`Updating company ${companyId} with data: ${JSON.stringify(companyData, null, 2)}`);
    try {
      const response = await axiosInstance.put(`/superAdmin/company/${companyId}`, companyData, {
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
  
  export const DeleteCompany = async (company_id) => {
    try {
      const response = await axiosInstance.delete(`/company/${company_id}`);
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