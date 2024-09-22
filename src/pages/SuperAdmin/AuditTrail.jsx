import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { GetSuperadminAuditTrail } from "../../apis/UserManagementAPI";

const AuditTrail = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selected, setSelected] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [orderBy, setOrderBy] = useState('dateCreated');
  const [order, setOrder] = useState('desc');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchData = async () => {
      try {
        const response = await GetSuperadminAuditTrail();
        const rowsWithUniqueIds = response.data.data.map((row, index) => ({
          ...row,
          uniqueId: `${row.audit_trail_id}-${index}`
        }));
        setOriginalRows(rowsWithUniqueIds);
        console.log("Fetched rows:", rowsWithUniqueIds.length);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching admins:", error);
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event, admin_id) => {
    const selectedIndex = selected.indexOf(admin_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, admin_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleRequestSort = useCallback((property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    console.log("Sorting changed:", property, isAsc ? 'desc' : 'asc');
  }, [order, orderBy]);

  const isSelected = (admin_id) => selected.indexOf(admin_id) !== -1;

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }

    return date.toISOString().split("T")[0];
  };

  const sortedRows = React.useMemo(() => {
    console.log("Sorting rows. Original count:", originalRows.length);
    const comparator = (a, b) => {
      if (orderBy === 'dateCreated') {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    };

    const sorted = [...originalRows].sort(comparator);
    console.log("Sorted rows count:", sorted.length);
    return sorted;
  }, [originalRows, order, orderBy]);

  console.log("Rendering with rows:", sortedRows.length);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        Audit Trail
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Track your admins
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 8 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          ml: 2,
        }}
      >
        <Box/>
        <TablePagination
          component="div"
          count={sortedRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Audit Trail ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Admin
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Company
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                <TableSortLabel
                  active={orderBy === 'dateCreated'}
                  direction={orderBy === 'dateCreated' ? order : 'asc'}
                  onClick={() => handleRequestSort('dateCreated')}
                >
                  Date Created
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Justification
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.admin_id);
                console.log(`Rendering row ${index}:`, row.uniqueId);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.admin_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.uniqueId}
                    selected={isItemSelected}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.audit_trail_id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.admin_name}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.company_name}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {formatDate(row.dateCreated)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.justification}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditTrail;