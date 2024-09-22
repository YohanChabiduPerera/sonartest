import axiosInstance from './AxiosInstance';

export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/common/getAllUsers');
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetAttorney = async (attorney_id) => {
  try {
    const response = await axiosInstance.get(`/attorney/${attorney_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetAllDoctors = async () => {
  try {
    const response = await axiosInstance.get('/doctor/');
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const GetAllAttorneys = async () => {
  try {
    const response = await axiosInstance.get('/attorney/');
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const GetAllExperts = async () => {
  try {
    const response = await axiosInstance.get('/expert/');
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetDoctor = async (doctor_id) => {
  try {
    const response = await axiosInstance.get(`/doctor/${doctor_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetAllClaimants = async () => {
  try {
    const response = await axiosInstance.get('/claimant');
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetClaimant = async (claimant_id) => {
  try {
    const response = await axiosInstance.get(`/claimant/${claimant_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetExpert = async (expert_id) => {
  try {
    const response = await axiosInstance.get(`/expert/${expert_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const AddDoctor = async (doctorData) => {
  try {
    const response = await axiosInstance.post('/doctor', doctorData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
};

export const AddAttorney = async (attorneyData) => {
  try {
    const response = await axiosInstance.post('/attorney', attorneyData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error adding attorney:", error);
    throw error;
  }
};

export const AddClaimant = async (claimantData) => {
  try {
    const response = await axiosInstance.post('/claimant', claimantData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error adding claimant:", error);
    throw error;
  }
};

export const AddExpert = async (expertData) => {
  try {
    const response = await axiosInstance.post('/expert', expertData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error adding expert:", error);
    throw error;
  }
};

export const UpdateDoctor = async (doctor_id, doctorData) => {
  try {
    const response = await axiosInstance.put(`/doctor/${doctor_id}`, doctorData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }
};

export const UpdateAttorney = async (attorney_id, attorneyData) => {
  try {
    const response = await axiosInstance.put(`/attorney/${attorney_id}`, attorneyData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error updating attorney:", error);
    throw error;
  }
};

export const UpdateClaimant = async (claimant_id, claimantData) => {
  try {
    const response = await axiosInstance.put(`/claimant/${claimant_id}`, claimantData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error updating claimant:", error);
    throw error;
  }
};

export const UpdateExpert = async (expert_id, expertData) => {
  try {
    const response = await axiosInstance.put(`/expert/${expert_id}`, expertData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error updating expert:", error);
    throw error;
  }
};

export const DeleteDoctor = async (doctor_id) => {
  try {
    const response = await axiosInstance.delete(`/doctor/${doctor_id}`);
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
};

export const DeleteAttorney = async (attorney_id) => {
  try {
    const response = await axiosInstance.delete(`/attorney/${attorney_id}`);
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error deleting attorney:", error);
    throw error;
  }
};

export const DeleteClaimant = async (claimant_id) => {
  try {
    const response = await axiosInstance.delete(`/claimant/${claimant_id}`);
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error deleting claimant:", error);
    throw error;
  }
};

export const DeleteExpert = async (expert_id) => {
  try {
    const response = await axiosInstance.delete(`/expert/${expert_id}`);
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error deleting expert:", error);
    throw error;
  }
};


export const GetAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get(`/admin/dashboard`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const GetSuperadminDashboard = async () => {
  try {
    const response = await axiosInstance.get(`/superAdmin/getSuperadminDashboard`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const GetSuperadminAuditTrail = async () => {
  try {
    const response = await axiosInstance.get(`/superAdmin/auditTrail`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


