import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
    return (
        <Box sx={{ display: 'flex', color: "#F7374F", zIndex: "999"}} className = "loader">
            <CircularProgress color="inherit"/>
        </Box>
    );
}