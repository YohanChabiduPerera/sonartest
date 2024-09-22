import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import SideNavigation from "./SideNavigation";
import { getFamilyNameFromToken, getGivenNameFromToken, getUserRoleFromToken } from "../utils/auth";

const Layout = ({ children }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const currentRole = getUserRoleFromToken();
  const first_name = getGivenNameFromToken();
  const last_name = getFamilyNameFromToken();
  let userRole = '';

  if (localStorage.getItem('userRole') === "admin")
    userRole = "Admin";
  else if (localStorage.getItem('userRole') === "attorney")
    userRole = "Attorney";
  else if (localStorage.getItem('userRole') === "expert")
    userRole = "Expert";
  else if (localStorage.getItem('userRole') === "super_admin")
    userRole = 'Super Admin';

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideNavigation 
        role={currentRole} 
        open={isSideNavOpen} 
        toggleDrawer={toggleSideNav}
      />
      <Box sx={{ flexGrow: 1, ml: "" }}>
        <Header 
          username={first_name + " " + last_name} 
          role={userRole} 
          isSideNavOpen={isSideNavOpen}
        />
        <Box sx={{ mt: 8, p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;