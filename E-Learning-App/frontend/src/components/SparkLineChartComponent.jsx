import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {SparkLineChart} from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLineComponent({tests, title}) {
    const [allPointsArray, setAllPointsArray] = useState([]);

    // load all points into an array
    useEffect(() => {
        function loadAllPointsIntoArray(){
            setAllPointsArray(tests.map(test => test.percentage));
        }
        if(tests.length > 0) loadAllPointsIntoArray();
    }, [tests])


    return (
        <>
            <h1 className = "text-white font-bold text-3xl mb-10">{title}</h1>
            <Stack direction="column" sx={{ width: '80%' }}>
                <Stack direction="column" sx={{ width: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <SparkLineChart
                            color="gray"
                            data={allPointsArray}
                            height={100}
                            showHighlight={true}
                            showTooltip={true}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <SparkLineChart
                            color="var(--main-color-orange)"
                            plotType="bar"
                            data={allPointsArray}
                            height={100}
                            showHighlight={true}
                            showTooltip={true}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
}

