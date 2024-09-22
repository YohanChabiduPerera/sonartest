import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import AddCase from './AddCase';
import AddCaseCont from './AddCaseCont';
import { CreateCase } from '../../apis/CaseManagementAPI';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
const MultiStepCaseForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const steps = ['Basic Information', 'Assign Team'];
  const navigate = useNavigate();

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (data) => {
    dispatch(setLoading(true));
    const finalData = { ...formData, ...data };
    console.log('Submitting data:', finalData);
    try {
      await CreateCase(finalData);
      // console.log('Case added successfully');
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error adding case:', error);
      dispatch(setLoading(false));
    } finally {
      navigate(`/case`);
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
        <AddCase onNext={handleNext} />
      )}

      {activeStep === 1 && (
        <>
          <AddCaseCont onSubmit={handleSubmit} />
          <Button onClick={handleBack}>Back</Button>
        </>
      )}
    </Box>
  );
};

export default MultiStepCaseForm;