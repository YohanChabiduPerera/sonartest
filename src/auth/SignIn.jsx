import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  FormControl,
  FormHelperText,
} from "@mui/material";
import login_img from "../assets/login.jpg";
import logo from "../assets/logo.jpg";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/loaderSlice";
import { getUserRoleFromResponseToken } from "../utils/auth";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordResetRequired, setIsPasswordResetRequired] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [session, setSession] = useState("");
  const BASE_URI = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const [updateStatus, setUpdateStatus] = useState("");
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newPasswordForReset, setNewPasswordForReset] = useState("");

  const CLIENT_ID = "15me6v83jqh6edpdgnp3dm48ro";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      username,
      password,
      newPassword: null,
      clientId: CLIENT_ID,
      // clientID: "jhv608dcepk65ev4hb6q3c8um",
    };

    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${BASE_URI}/common/login`, body);
      const responseData = response.data.data;

      if (responseData.message === "Password reset required") {
        setIsPasswordResetRequired(true);
        setSession(responseData.data.session);
        dispatch(setLoading(false));
      } else if (responseData.message === "login successful") {
        const authData = responseData.data.AuthenticationResult;
        const userRole = getUserRoleFromResponseToken(authData.IdToken);
        login(
          { username },
          authData.AccessToken,
          authData.RefreshToken,
          authData.IdToken,
          userRole
        );
        dispatch(setLoading(false));
        if (userRole === "attorney") {
          navigate("/attDash");
        } else if (userRole === "admin") {
          navigate("/dashboard");
        } else if (userRole === "expert") {
          navigate("/expDash");
        } else if (userRole === "super_admin") {
          navigate("/superAdmin/dashboard");
        }
      }
    } catch (error) {
      console.error("Error sending data:", error);
      if (error.response.data.message == "invalid credentials") {
        setUpdateStatus("invalidCredentials");
      }
      dispatch(setLoading(false));
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /[0-9]/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;

    return {
      minLength: password.length >= minLength,
      hasNumber: hasNumber.test(password),
      hasUppercase: hasUppercase.test(password),
      hasLowercase: hasLowercase.test(password),
    };
  };

  const isPasswordValid = (password) => {
    const validation = validatePassword(password);
    return (
      validation.minLength &&
      validation.hasNumber &&
      validation.hasUppercase &&
      validation.hasLowercase
    );
  };

  const handlePasswordReset = async () => {
    const body = {
      username: username,
      password: oldPassword,
      newPassword: newPassword,
      clientId: CLIENT_ID,
      // clientID: "jhv608dcepk65ev4hb6q3c8um",
    };

    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${BASE_URI}/common/login`, body);
      const responseData = response.data.data;
      // console.log("response", responseData)
      if (responseData.message === "password changed successfully") {
        const authData = responseData.data.AuthenticationResult;
        const userRole = getUserRoleFromResponseToken(authData.IdToken);
        login(
          { username },
          authData.AccessToken,
          authData.RefreshToken,
          authData.IdToken,
          userRole
        );
        setIsPasswordResetRequired(false);
        dispatch(setLoading(false));
        if (userRole === "attorney") {
          navigate("/attDash");
        } else if (userRole === "admin") {
          navigate("/dashboard");
        } else if (userRole === "expert") {
          navigate("/expDash");
        } else if (userRole === "super_admin") {
          navigate("/superAdmin/dashboard");
        }
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      dispatch(setLoading(false));
    }
  };

  const  passwordValidation = validatePassword(newPassword);
  const passwordValidationReset = validatePassword(newPasswordForReset);

  const handleForgotPassword = async () => {
    if (!username) {
      setUpdateStatus("Please enter your username");
      return;
    }
    try {
      dispatch(setLoading(true));
      await axios.post(`${BASE_URI}/common/forgotPassword`, {
        username,
        clientId: CLIENT_ID,
      });
      setIsOtpSent(true);
      setUpdateStatus("OTP sent to your registered email");
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      setUpdateStatus("Failed to send OTP. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleResetPassword = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6 || !username || !newPasswordForReset) {
      setUpdateStatus("Please fill in all fields");
      return;
    }
    if (!isPasswordValid(newPasswordForReset)) {
      setUpdateStatus("Password does not meet the requirements");
      return;
    }
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${BASE_URI}/common/resetPassword`, {
        username,
        newPassword: newPasswordForReset,
        confirmationCode: otpString,
        clientId: CLIENT_ID,
      });
      setUpdateStatus(
        "Password reset successful. Please login with your new password."
      );
      setIsForgotPasswordMode(false);
      setIsOtpSent(false);
      const responseData = response.data.data;

      if (responseData.message === "password changed successfully") {
        const authData = responseData.data.AuthenticationResult;
        const userRole = getUserRoleFromResponseToken(authData.IdToken);
        login(
          { username },
          authData.AccessToken,
          authData.RefreshToken,
          authData.IdToken,
          userRole
        );
        setIsPasswordResetRequired(false);
        dispatch(setLoading(false));
        if (userRole === "attorney") {
          navigate("/attDash");
        } else if (userRole === "admin") {
          navigate("/dashboard");
        } else if (userRole === "expert") {
          navigate("/expDash");
        } else if (userRole === "super_admin") {
          navigate("/superAdmin/dashboard");
        }
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setUpdateStatus("Failed to reset password. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 4,
            backgroundColor: "background.default",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={logo} alt="Logo" style={{ marginRight: 8, height: 40 }} />
            Medico Online
          </Typography>
          <Box sx={{ maxWidth: 400, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom>
              {isForgotPasswordMode
                ? "Reset Your Password"
                : "Login to Your Account"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {isForgotPasswordMode
                ? "Enter your username to reset your password"
                : "Enter your Credentials to access your account"}
            </Typography>
            <form
              onSubmit={
                isForgotPasswordMode ? (e) => e.preventDefault() : handleSubmit
              }
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {!isForgotPasswordMode && (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              {isForgotPasswordMode && isOtpSent && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        variant="outlined"
                        margin="normal"
                        required
                        sx={{ width: "40px" }}
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: "center" },
                        }}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                      />
                    ))}
                  </Box>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={newPasswordForReset}
                    onChange={(e) => setNewPasswordForReset(e.target.value)}
                  />
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2">
                      Password Requirements:
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <FormHelperText error={!passwordValidationReset.minLength}>
                        {passwordValidationReset.minLength
                          ? "✓ Minimum 8 Characters"
                          : "✗ Minimum 8 Characters"}
                      </FormHelperText>
                      <FormHelperText error={!passwordValidationReset.hasNumber}>
                        {passwordValidationReset.hasNumber
                          ? "✓ At least 1 number"
                          : "✗ At least 1 number"}
                      </FormHelperText>
                      <FormHelperText error={!passwordValidationReset.hasUppercase}>
                        {passwordValidationReset.hasUppercase
                          ? "✓ At least 1 uppercase letter"
                          : "✗ At least 1 uppercase letter"}
                      </FormHelperText>
                      <FormHelperText error={!passwordValidationReset.hasLowercase}>
                        {passwordValidationReset.hasLowercase
                          ? "✓ At least 1 lowercase letter"
                          : "✗ At least 1 lowercase letter"}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </>
              )}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={
                  isForgotPasswordMode
                    ? isOtpSent
                      ? handleResetPassword
                      : handleForgotPassword
                    : handleSubmit
                }
                disabled={
                  isForgotPasswordMode &&
                  isOtpSent &&
                  !isPasswordValid(newPasswordForReset)
                }
              >
                {isForgotPasswordMode
                  ? isOtpSent
                    ? "Reset Password"
                    : "Send OTP"
                  : "Login"}
              </Button>
              <Button
                fullWidth
                variant="text"
                color="primary"
                sx={{ marginTop: 1 }}
                onClick={() => setIsForgotPasswordMode(!isForgotPasswordMode)}
              >
                {isForgotPasswordMode ? "Back to Login" : "Forgot Password?"}
              </Button>
              {updateStatus && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor:
                      updateStatus === "invalidCredentials"
                        ? "#EB5757"
                        : "#4CAF50",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  {updateStatus === "invalidCredentials" && (
                    <DoDisturbAltTwoToneIcon sx={{ mr: 1 }} />
                  )}
                  <Typography>{updateStatus}</Typography>
                </Box>
              )}
            </form>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundImage: `url(${login_img})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>

      {/* Password Reset Modal */}
      <Modal
        open={isPasswordResetRequired}
        onClose={() => setIsPasswordResetRequired(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Reset Your Password
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="oldPassword"
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body2">Password Requirements:</Typography>
            <FormControl fullWidth margin="normal">
              <FormHelperText error={!passwordValidation.minLength}>
                {passwordValidation.minLength
                  ? "✓ Minimum 8 Characters"
                  : "✗ Minimum 8 Characters"}
              </FormHelperText>
              <FormHelperText error={!passwordValidation.hasNumber}>
                {passwordValidation.hasNumber
                  ? "✓ At least 1 number"
                  : "✗ At least 1 number"}
              </FormHelperText>
              <FormHelperText error={!passwordValidation.hasUppercase}>
                {passwordValidation.hasUppercase
                  ? "✓ At least 1 uppercase letter"
                  : "✗ At least 1 uppercase letter"}
              </FormHelperText>
              <FormHelperText error={!passwordValidation.hasLowercase}>
                {passwordValidation.hasLowercase
                  ? "✓ At least 1 lowercase letter"
                  : "✗ At least 1 lowercase letter"}
              </FormHelperText>
            </FormControl>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handlePasswordReset}
            disabled={!isPasswordValid}
          >
            Reset Password
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SignIn;
