import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, parseISO } from "date-fns";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";
import { getGivenNameFromToken } from "../../../utils/auth";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import {
  GetAdminDashboard,
  GetAllUsers,
  GetSuperadminDashboard,
} from "../../../apis/UserManagementAPI";
import { CorporateFare, People } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const SuperAdminDashboard = () => {
  const first_name = getGivenNameFromToken();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [date, setDate] = useState(new Date());
  const [assessmentData, setAssessmentData] = useState([]);
  const [filteredAssessmentData, setFilteredAssessmentData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [documentTypeData, setDocumentTypeData] = useState([]);
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [caseStatusData, setCaseStatusData] = useState([]);

  const types = [
    "RAF1",
    "RAF4",
    "OSR",
    "HR",
    "NR",
    "AR",
    "XR",
    "POE",
    "PAYSLIP",
    "CP",
    "IP",
    "OT",
    "OT_TAKE_IN",
    "EP",
    "MAXILLO",
    "PLASTIC_SURGEON",
    "OTHER",
  ];

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const responseDashboard = await GetSuperadminDashboard();
        // console.log("responseDashboard: ", responseDashboard.data);
        const fetchedDashboard = responseDashboard.data;

        const fetchedAdmins = fetchedDashboard.data.admins;
        const totalUsers =
          fetchedDashboard.data.expertCount +
            fetchedDashboard.data.claimantCount +
            fetchedDashboard.data.attorneyCount +
            fetchedDashboard.data.doctorCount || 0;

        const fetchedUsers = {
          expertCount: fetchedDashboard.data.expertCount,
          claimantCount: fetchedDashboard.data.claimantCount,
          attorneyCount: fetchedDashboard.data.attorneyCount,
          doctorCount: fetchedDashboard.data.doctorCount,
          totalUsers: totalUsers,
        };
        const fetchedCompanies = fetchedDashboard.data.companies;

        // console.log("FETCHED USERS: ", fetchedUsers);
        setUsers(fetchedUsers);
        setCompanies(fetchedCompanies);
        setAdmins(fetchedAdmins);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching admins:", error);
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, []);

  const getRecentAdmins = (admins) => {
    return admins
      .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
      .slice(0, 5);
  };
  const getRecentCompanies = (companies) => {
    return companies
      .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
      .slice(0, 5);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const responseDashboard = await GetAdminDashboard();
        // console.log("Response Dashboard: ", responseDashboard);
        // const response = await GetAllCases();
        // console.log("Response Cases: ", responseDashboard.data.data.cases);
        const fetchedCases = responseDashboard.data.data.cases;
        setCases(fetchedCases);

        // const responseUsers = await GetAllUsers();
        // console.log("Response Users: ", responseUsers);

        const fetchedUsers = responseDashboard.data.data.users.data;
        // console.log("FETCHED USERS: ", fetchedUsers);
        const totalUsers =
          fetchedUsers.doctors.length +
          (fetchedUsers.claimants ? fetchedUsers.claimants.length : 0) +
          fetchedUsers.attorneys.length +
          (fetchedUsers.experts ? fetchedUsers.experts.length : 0);
        setUsers(totalUsers);

        // const responseDocuments = await GetDocuments();
        // console.log(
        //   "Response Documents: ",
        //   responseDashboard.data.data.documents
        // );
        const fetchedDocuments = responseDashboard.data.data.documents;
        setDocuments(fetchedDocuments);

        const statusCounts = fetchedCases.reduce((acc, caseItem) => {
          acc[caseItem.status] = (acc[caseItem.status] || 0) + 1;
          return acc;
        }, {});

        setCaseStatusData([
          { name: "Active", value: statusCounts["Active"] || 0 },
          { name: "Completed", value: statusCounts["Completed"] || 0 },
        ]);

        const processedAssessmentData = processAssessmentData(fetchedDocuments);
        setAssessmentData(processedAssessmentData);
        setFilteredAssessmentData(processedAssessmentData);

        const years = [
          ...new Set(
            processedAssessmentData.map((item) => item.date.slice(0, 4))
          ),
        ];
        setAvailableYears(years);
        setSelectedYear(years[years.length - 1]);

        const months = [
          ...new Set(
            processedAssessmentData.map((item) => item.date.slice(5, 7))
          ),
        ];
        setAvailableMonths(months);

        const typeCounts = fetchedDocuments.reduce((acc, docItem) => {
          acc[docItem.type] = (acc[docItem.type] || 0) + 1;
          // console.log("docItem", docItem);
          return acc;
        }, {});
        // console.log("typeCounts", typeCounts);

        setDocumentTypeData(
          types.map((type) => ({
            name: type,
            count: typeCounts[type] || 0,
          }))
        );

        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching cases:", error);
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, []);

  const processAssessmentData = (documents) => {
    const groupedData = documents.reduce((acc, doc) => {
      const date = new Date(doc.dateCreated);
      const monthYear = date.toISOString().slice(0, 7);

      if (!acc[monthYear]) {
        acc[monthYear] = {
          RAF1: 0,
          RAF4: 0,
          OSR: 0,
          HR: 0,
          NR: 0,
          AR: 0,
          XR: 0,
          POE: 0,
          PAYSLIP: 0,
          CP: 0,
          IP: 0,
          OT: 0,
          OT_TAKE_IN: 0,
          EP: 0,
          MAXILLO: 0,
          PLASTIC_SURGEON: 0,
          OTHER: 0,
        };
      }

      switch (doc.type) {
        case "RAF1":
          acc[monthYear].RAF1++;
          break;
        case "RAF4":
          acc[monthYear].RAF4++;
          break;
        case "OSR":
          acc[monthYear].OSR++;
          break;
        case "HR":
          acc[monthYear].HR++;
          break;
        case "NR":
          acc[monthYear].NR++;
          break;
        case "AR":
          acc[monthYear].AR++;
          break;
        case "XR":
          acc[monthYear].XR++;
          break;
        case "POE":
          acc[monthYear].POE++;
          break;
        case "PAYSLIP":
          acc[monthYear].PAYSLIP++;
          break;
        case "CP":
          acc[monthYear].CP++;
          break;
        case "IP":
          acc[monthYear].IP++;
          break;
        case "OT":
          acc[monthYear].OT++;
          break;
        case "OT_TAKE_IN":
          acc[monthYear].OT_TAKE_IN++;
          break;
        case "EP":
          acc[monthYear].EP++;
          break;
        case "MAXILLO":
          acc[monthYear].MAXILLO++;
          break;
        case "PLASTIC_SURGEON":
          acc[monthYear].PLASTIC_SURGEON++;
          break;
        case "OTHER":
          acc[monthYear].OTHER++;
          break;
      }

      return acc;
    }, {});

    return Object.entries(groupedData)
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
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

  useEffect(() => {
    // Filter data when year or month changes
    const filteredData = assessmentData.filter((item) => {
      const itemYear = item.date.slice(0, 4);
      const itemMonth = item.date.slice(5, 7);
      return (
        (!selectedYear || itemYear === selectedYear) &&
        (!selectedMonth || itemMonth === selectedMonth)
      );
    });
    setFilteredAssessmentData(filteredData);
  }, [selectedYear, selectedMonth, assessmentData]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const CHART_COLORS = {
    RAF1: "#8884d8",
    RAF4: "#82ca9d",
    OSR: "#ffc658",
    HR: "#ff8042",
    NR: "#a4de6c",
    AR: "#d0ed57",
    XR: "#8dd1e1",
    POE: "#83a6ed",
    PAYSLIP: "#8884d8",
    CP: "#82ca9d",
    IP: "#ffc658",
    OT: "#ff8042",
    OT_TAKE_IN: "#994C27",
    EP: "#a4de6c",
    MAXILLO: "#d0ed57",
    PLASTIC_SURGEON: "#8dd1e1",
    OTHER: "#83a6ed",
  };

  const COLORS = ["#1F9254", "#A30D11", "#FFBB28"];
  const LINE_COLORS = Object.values(CHART_COLORS);
  const BAR_COLORS = Object.values(CHART_COLORS);
    // console.log("USERS: " + users.expertCount);
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        Super Admin Dashboard
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
                <People sx={{ fontSize: 30 }} />
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
                  {admins.length}
                </Typography>
                <Typography variant="h6" sx={{ color: "#464255" }}>
                  Total Admins
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 - Takes up 2/3 of the width */}
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
                <CorporateFare sx={{ fontSize: 30 }} />
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
                  {companies.length}
                </Typography>
                <Typography variant="h6" sx={{ color: "#464255" }}>
                  Total Companies
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#C6EAE5",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
              }}
            >
              <PersonOutlineOutlinedIcon
                sx={{ fontSize: 60, color: "#00B074", mr: 3 }}
              />
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#464255" }}
                  >
                    Experts: {users.expertCount}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#464255" }}
                  >
                    Attorneys: {users.attorneyCount}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#464255" }}
                  >
                    Doctors: {users.doctorCount}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#464255" }}
                  >
                    Claimants: {users.claimantCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Card 4 - Recent Companies */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#F7F9FB", height: "100%" }}>
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.secondary, mb: 2 }}
                >
                  Recent Companies
                </Typography>
              </Grid>
              <List>
                {getRecentCompanies(companies).map((companyItem, index) => (
                  <React.Fragment key={companyItem.company_id}>
                    <ListItem>
                      <ListItemText
                        primary={companyItem.company_name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {companyItem.company_id}
                            </Typography>
                            {" — "}
                            {format(
                              parseISO(companyItem.dateCreated),
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
                        primaryTypographyProps={{
                          component: "div",
                          sx: {
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </ListItem>
                    {index < getRecentAdmins(admins).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5 - Recent Admins */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#F7F9FB", height: "100%" }}>
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.secondary, mb: 2 }}
                >
                  Recent Admins
                </Typography>
              </Grid>
              <List>
                {getRecentAdmins(admins).map((adminItem, index) => (
                  <React.Fragment key={adminItem.admin_id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          adminItem.first_name + " " + adminItem.last_name
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {adminItem.admin_id}
                            </Typography>
                            {" — "}
                            {format(
                              parseISO(adminItem.dateCreated),
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
                        primaryTypographyProps={{
                          component: "div",
                          sx: {
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </ListItem>
                    {index < getRecentAdmins(admins).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              height: "100%",
            }}
          >
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.secondary, mb: 2 }}
                >
                  Calendar
                </Typography>
                <Calendar
                  onChange={setDate}
                  value={date}
                  className={
                    theme.palette.mode === "dark" ? "react-calendar--dark" : ""
                  }
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      
      {/* Assessment Trend Line Chart */}
      <Grid item xs={12} sm={12} md={6}>
        {" "}
        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            height: "100%",
          }}
        >
          <CardContent>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.secondary, mb: 2 }}
              >
                Assessment Trends
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mb: 2,
                }}
              >
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    label="Year"
                  >
                    <MenuItem value="">All</MenuItem>
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    label="Month"
                  >
                    <MenuItem value="">All</MenuItem>
                    {availableMonths.map((month) => (
                      <MenuItem key={month} value={month}>
                        {new Date(`2000-${month}-01`).toLocaleString(
                          "default",
                          { month: "long" }
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={filteredAssessmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={theme.palette.text.primary} />
                  <YAxis
                    stroke={theme.palette.text.primary}
                    allowDecimals={false}
                    // domain={[0, 'dataMax']}
                    // tickCount={5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                    }}
                  />
                  <Legend />
                  {Object.keys(CHART_COLORS).map((key) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={CHART_COLORS[key]}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Second row with Document Type Distribution */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.secondary, mb: 2 }}
              >
                Document Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={documentTypeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke={theme.palette.text.primary} />
                  <YAxis
                    stroke={theme.palette.text.primary}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8">
                    {documentTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;
