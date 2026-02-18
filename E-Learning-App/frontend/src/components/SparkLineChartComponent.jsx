import * as React from 'react';
import {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {SparkLineChart} from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLineComponent({tests, title}) {
    const [allPointsArray, setAllPointsArray] = useState([]);
    const NO_TESTS = tests.length === 0;

    // load all points into an array
    useEffect(() => {
        function loadAllPointsIntoArray(){
            setAllPointsArray(tests.map(test => test.percentage));
        }
        if(!NO_TESTS) loadAllPointsIntoArray()
        // if no tests, fill up with made up values for illustration
        else setAllPointsArray([
            12.47, 98.31, 45.62, 3.89, 76.54,
            54.21, 88.90, 27.36, 61.73, 19.58,
            72.04, 34.67, 90.12, 6.45, 58.29,
            41.83, 99.99, 23.14, 67.50, 84.26,
            15.78, 39.02, 70.66
        ]);
    }, [tests])


    return (
        <>
            <h1 className = "text-white font-bold text-3xl mb-10">{title}</h1>
            {NO_TESTS && <h3 className = "text-gray-500 font-bold text-md mb-10">Žiadne testy. Graf je ilustračný</h3>}
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

