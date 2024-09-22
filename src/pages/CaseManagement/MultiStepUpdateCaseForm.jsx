import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import UpdateCase from './UpdateCase';
import UpdateCaseCont from './UpdateCaseCont';
import { UpdateCase as updateCaseAPI } from '../../apis/CaseManagementAPI';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
const MultiStepUpdateCaseForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { case_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const steps = ['Update Information', 'Update Team'];

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (data) => {
    const finalData = { ...formData, ...data };
    dispatch(setLoading(true));
    try {
      await updateCaseAPI(case_id, finalData);
      // console.log('Case updated successfully');
      dispatch(setLoading(false));
      navigate('/case'); 
    } catch (error) {
      console.error('Error updating case:', error);
      dispatch(setLoading(false));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <UpdateCase case_id={case_id} onNext={handleNext} />
      )}

      {activeStep === 1 && (
        <>
          <UpdateCaseCont case_id={case_id} onSubmit={handleSubmit} />
          <Button onClick={handleBack}>Back</Button>
        </>
      )}
    </Box>
  );
};

export default MultiStepUpdateCaseForm;
