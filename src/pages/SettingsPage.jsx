import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { useColorMode } from '../utils/ThemeProvider';

const SettingsPage = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });
  const [userRole, setUserRole] = useState('');
  const { toggleColorMode } = useColorMode();

  useEffect(() => {
    setUserDetails({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
    });

    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = () => {
    console.log('Password reset requested');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}>
        Settings
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Manage Your Settings Here
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <TextField
          label="First Name"
          name="firstName"
          value={userDetails.firstName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={userDetails.lastName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Username"
          name="username"
          value={userDetails.username}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          fullWidth
          type="email"
        />
      </Box>
      
      {(userRole === 'admin' || userRole === 'attorney') && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleResetPassword}
          sx={{ mt: 2 }}
        >
          Reset Password
        </Button>
      )}
      
      <FormControlLabel
        control={<Switch onChange={toggleColorMode} />}
        label="Dark Mode"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default SettingsPage;