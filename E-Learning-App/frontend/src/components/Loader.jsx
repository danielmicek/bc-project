import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
    return (
        <Box sx={{ display: 'flex', color: "#F7374F", zIndex: "999"}} className = "absolute left-1/2 top-1/2 z-[999]">
            <CircularProgress color="inherit"/>
        </Box>
    );
}