import axiosInstance from './AxiosInstance';

export const GetDocuments = async () => {
  try {
    const response = await axiosInstance.get('/document');
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const GetDocumentsByAttorney = async (attorney_id) => {
  try {
    const response = await axiosInstance.get(`/document/attorney/${attorney_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const GetDocumentsByExpert = async (expert_id) => {
  try {
    const response = await axiosInstance.get(`/document/expert/${expert_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const CreateDocument = async (documentData) => {
  // console.log(`Data: ${JSON.stringify(documentData, null, 2)}`);
  try {
    const response = await axiosInstance.post('/document', documentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

export const GetSingleDocument = async (document_id) => {
  try {
    const response = await axiosInstance.get(`/document/${document_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const SearchDocument = async (documentName) => {
  try {
    const response = await axiosInstance.get(`/document/search?documentName=${documentName}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const GetDocumentsByCase = async (case_id) => {
  try {
    const response = await axiosInstance.get(`/document/case/${case_id}`);
    // console.log(`Results: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const UpdateSingleDocument = async (documentId, documentData) => {
  // console.log(`Updating document ${documentId} with data: ${JSON.stringify(documentData, null, 2)}`);
  try {
    const response = await axiosInstance.put(`/document/${documentId}`, documentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const DeleteDocument = async (document_id) => {
  try {
    const response = await axiosInstance.delete(`/document/${document_id}`);
    // console.log(`Success: ${JSON.stringify(response.data, null, 2)}`);
    return response;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
