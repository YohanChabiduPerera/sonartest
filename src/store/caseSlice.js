import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  caseName: '',
  patientId: '',
  endDate: null,
  description: '',
  fileInfo: null, // Changed from 'file' to 'fileInfo'
  selectedDoctors: [],
  selectedAttorneys: [],
  selectedExperts: [],
};

const caseSlice = createSlice({
  name: 'case',
  initialState,
  reducers: {
    updateCaseData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateFileInfo: (state, action) => {
      state.fileInfo = action.payload;
    },
    resetCaseData: () => initialState,
  },
});

export const { updateCaseData, updateFileInfo, resetCaseData } = caseSlice.actions;
export default caseSlice.reducer;