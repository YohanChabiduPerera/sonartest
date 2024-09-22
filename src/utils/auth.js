// utils/auth.js

import * as jwtDecode from 'jwt-decode';

const getToken = () => {
  const token = localStorage.getItem('IdToken');
  if (!token) {
    console.error('No IdToken found in local storage');
    return null;
  }
  return token;
};

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const userId = decodedToken['custom:user_id'];
    return userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUsernameFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const username = decodedToken['cognito:username'];
    return username;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getCompanyIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const companyId = decodedToken['custom:company_id'];
    return companyId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getEmailFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const email = decodedToken['email'];
    return email;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getGivenNameFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const givenName = decodedToken['given_name'];
    return givenName;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getFamilyNameFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const familyName = decodedToken['family_name'];
    return familyName;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
export const getUserRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const userRole = decodedToken['custom:user_type'];
    return userRole;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
export const getUserRoleFromResponseToken = (responseToken) => {
  const token = responseToken;
  if (!token) return null;

  try {
    const decodedToken = jwtDecode.jwtDecode(token);
    const userRole = decodedToken['custom:user_type'];
    return userRole;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
