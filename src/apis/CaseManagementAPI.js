import axiosInstance from './AxiosInstance';

import { getUserIdFromToken } from '../utils/auth';

const userId = getUserIdFromToken();
// console.log(`User ID: ${userId}`);

export const GetAllCases = async () => {
  try {
    const response = await axiosInstance.get('/case');
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const GetSingleCase = async (case_id) => {
  try {
    const response = await axiosInstance.get(`/case/${case_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const SearchCase = async (caseName) => {
  try {
    const response = await axiosInstance.get(`/case/search?caseName=${caseName}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const GetCaseByAttorney = async (attorney_id) => {
  try {
    const response = await axiosInstance.get(`/case/attorney/${attorney_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    console.log("RESPONSE: ", response)
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// export const GetCaseByAttorney = async (attorney_id, logout) => {
//   try {
//     const response = await axiosInstance.get(`/case/attorney/${attorney_id}`);
//     return response;
//   } catch (error) {
//     console.error('Error fetching data:', error);
    
//     // Check for authentication-related errors (401 Unauthorized or 403 Forbidden)
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       await logout();  // Logout if token is invalid
//     }
    
//     throw error;  // Propagate the error for further handling
//   }
// };

export const GetCaseByExpert = async (expert_id) => {
  try {
    const response = await axiosInstance.get(`/case/expert/${expert_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
export const GetCaseByDoctor = async (doctor_id) => {
  try {
    const response = await axiosInstance.get(`/case/doctor/${doctor_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const CreateCase = async (caseData) => {
  // console.log(`Data: ${JSON.stringify(caseData, null, 2)}`);
  try {
    const response = await axiosInstance.post('/case', caseData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error adding case:', error);
    throw error;
  }
};

export const UpdateCase = async (caseId, caseData) => {
  // console.log(`Updating case ${caseId} with data: ${JSON.stringify(caseData, null, 2)}`);
  try {
    const response = await axiosInstance.put(`/case/${caseId}`, caseData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error updating case:', error);
    throw error;
  }
};

export const DeleteCase = async (case_id) => {
  try {
    const response = await axiosInstance.delete(`/case/${case_id}`);
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error deleting case:', error);
    throw error;
  }
};
