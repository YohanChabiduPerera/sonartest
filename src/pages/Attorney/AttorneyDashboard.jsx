import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GetCaseByAttorney } from "../../apis/CaseManagementAPI";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { format, parseISO, isBefore, isValid } from "date-fns"; 
import { getFamilyNameFromToken, getGivenNameFromToken, getUserIdFromToken } from "../../utils/auth";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { GetAttorney } from "../../apis/UserManagementAPI";
import { useNavigate } from "react-router-dom";
const AttorneyDashboard = () => {
  const first_name = getGivenNameFromToken();
  const last_name = getFamilyNameFromToken();

  const [cases, setCases] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [date, setDate] = useState(new Date());
  const [caseStatusData, setCaseStatusData] = useState([]);
  const [urgentCases, setUrgentCases] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await GetCaseByAttorney(getUserIdFromToken());
        console.log("Response: ", response.data.data);
        const fetchedCases = response.data.data;
        setCases(fetchedCases);
  
        const statusCounts = fetchedCases.reduce((acc, caseItem) => {
          acc[caseItem.status] = (acc[caseItem.status] || 0) + 1;
          return acc;
        }, {});
  
        setCaseStatusData([
          { name: "Active", value: statusCounts["Active"] || 0 },
          { name: "Inactive", value: statusCounts["Inactive"] || 0 },
          { name: "Pending", value: statusCounts["Pending"] || 0 },
        ]);
  
        const urgent = getUrgentCases(fetchedCases);
        setUrgentCases(urgent);
        console.log("Urgent cases:", urgent); 
        dispatch(setLoading(false));

      } catch (error) {
        console.error("Error fetching cases:", error);
        dispatch(setLoading(false));
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAttorneyData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await GetAttorney(getUserIdFromToken());
        console.log("Response: ", response.data.data);
        const fetchedAttorney = response.data.data;
        setAttorneys(fetchedAttorney);
  
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching cases:", error);
        dispatch(setLoading(false));
      }
    };
  
    fetchAttorneyData();
  }, []);
  

  const getRecentCases = (cases) => {
    return cases
      .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
      .slice(0, 5);
  };

const getUrgentCases = (cases) => {
  const today = new Date();
  
  return cases
    .filter((caseItem) => {
      if (!caseItem.estimated_end_date) return false;
      const endDate = parseISO(caseItem.estimated_end_date);
      return isValid(endDate) && !isBefore(endDate, today);
    })
    .sort((a, b) => {
      const endDateA = parseISO(a.estimated_end_date);
      const endDateB = parseISO(b.estimated_end_date);
      return endDateA - endDateB;
    })
    .slice(0, 5);
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "Invalid Date";
  }

  return date.toISOString().split("T")[0];
};

const handleSeeMore =  () => {
  navigate(`/attorney/case/view/attorney/${getUserIdFromToken()}`)
}

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        Attorney Dashboard
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Hi, {first_name}. Welcome back!
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#C6EAE5",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "16px", 
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#00B074",
                  mr: 3,
                  width: 60,
                  height: 60,
                }}
              >
                <WorkIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#464255",
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  {cases.length}
                </Typography>
                <Typography variant="h6" sx={{ color: "#464255" }}>
                  Total Cases
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              backgroundColor: "#C6EAE5",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", 
                  width: "100%",
                  maxWidth: 800, 
                }}
              >
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#464255",
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                  >
                    {first_name + " " + last_name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "#464255" }}>
                    {attorneys.lawFirm}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large" 
                  sx={{
                    bgcolor: "#39C7AD",
                    color: "white",
                    "&:hover": { bgcolor: "#2EA08F" },
                    py: 1.5, 
                    px: 3, 
                  }}
                  onClick={handleSeeMore}
                >
                  See More
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Second row with three cards */}
      <Grid container spacing={3}>
        {/* Card 3 - Case Status Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#F7F9FB", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#797979", mb: 2 }}>
                Case Status Distribution
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={caseStatusData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {caseStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4 - Recent Cases */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#F7F9FB", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#797979", mb: 2 }}>
                Recent Cases
              </Typography>
              <List>
                {getRecentCases(cases).map((caseItem, index) => (
                  <React.Fragment key={caseItem.case_id}>
                    <ListItem>
                      <ListItemText
                        primary={caseItem.caseName}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {caseItem.case_id}
                            </Typography>
                            {" — "}
                            {format(
                              parseISO(caseItem.dateCreated),
                              "MMM d, yyyy"
                            )}
                          </>
                        }
                        secondaryTypographyProps={{
                          component: "div",
                          sx: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1,
                          },
                        }}
                      />
                    </ListItem>
                    {index < getRecentCases(cases).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5 - Urgent Cases */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#F7F9FB", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#797979", mb: 2 }}>
                Urgent Cases
              </Typography>
              {urgentCases.length > 0 ? (
                <List>
                  {urgentCases.map((caseItem, index) => (
                    <React.Fragment key={caseItem.case_id}>
                      <ListItem>
                        <ListItemText
                          primary={caseItem.caseName}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {caseItem.case_id}
                              </Typography>
                              {" — Due: "}
                              {formatDate(caseItem.estimated_end_date)}
                            </>
                          }
                          secondaryTypographyProps={{
                            component: "div",
                            sx: {
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 1,
                              color: isBefore(
                                parseISO(caseItem.estimated_end_date),
                                new Date()
                              )
                                ? "error.main"
                                : "inherit",
                            },
                          }}
                        />
                      </ListItem>
                      {index < urgentCases.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No urgent cases found.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttorneyDashboard;
