import React, { useState } from 'react';
import { Box, Typography, Paper, Popper, ClickAwayListener } from '@mui/material';
import { differenceInDays, parseISO, format } from 'date-fns';

const MAX_DISPLAY_DOCS = 2;

const CaseTimeline = ({ startDate, endDate, documents }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopperDate, setOpenPopperDate] = useState(null);

  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const totalDays = differenceInDays(end, start);

  const getPositionPercentage = (date) => {
    const current = parseISO(date);
    const daysPassed = differenceInDays(current, start);
    return (daysPassed / totalDays) * 100;
  };

  // Group documents by date
  const groupedDocuments = documents.reduce((acc, doc) => {
    const date = format(parseISO(doc.dateCreated), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(doc);
    return acc;
  }, {});

  const handlePopperOpen = (event, date) => {
    setAnchorEl(event.currentTarget);
    setOpenPopperDate(date);
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
    setOpenPopperDate(null);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Box sx={{ mt: 0, mb: 6, position: 'relative' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Case Timeline</Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          {format(start, 'MMM d, yyyy')}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          {format(end, 'MMM d, yyyy')}
        </Typography>
      </Box>
      
      <Box sx={{ height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, position: 'relative', mb: 4 }}>
        <Box sx={{ 
          height: '100%', 
          backgroundColor: '#4caf50', 
          borderRadius: 4, 
          width: '100%',
        }} />
      </Box>
      
      {Object.entries(groupedDocuments).map(([date, docs], index) => {
        const displayedDocs = docs.slice(0, MAX_DISPLAY_DOCS);
        const remainingCount = docs.length - MAX_DISPLAY_DOCS;
        
        return (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${getPositionPercentage(date)}%`,
              top: 48,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 150,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#3f51b5',
                border: '2px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                zIndex: 2,
              }}
            />
            <Box
              sx={{
                height: 24,
                width: 2,
                backgroundColor: '#3f51b5',
                my: 0.5,
              }}
            />
            <Paper
              elevation={2}
              sx={{
                p: 1,
                maxWidth: '100%',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
              }}
              onClick={(e) => handlePopperOpen(e, date)}
            >
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem' }}>
                {displayedDocs.map(doc => truncateText(doc.name, 15)).join(', ')}
                {remainingCount > 0 && `, and ${remainingCount} more`}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                {format(parseISO(date), 'MMM d, yyyy')}
              </Typography>
            </Paper>
            <Popper open={openPopperDate === date} anchorEl={anchorEl} placement="top" sx={{ zIndex: 1300 }}>
              <ClickAwayListener onClickAway={handlePopperClose}>
                <Paper sx={{ p: 2, maxWidth: 300 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Documents on {format(parseISO(date), 'MMM d, yyyy')}:</Typography>
                  {docs.map((doc, i) => (
                    <Typography key={i} variant="body2">{doc.name}</Typography>
                  ))}
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>
        );
      })}
    </Box>
  );
};

export default CaseTimeline;