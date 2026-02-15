import Box from '@mui/material/Box';
import {BarChart} from '@mui/x-charts/BarChart';
import {getMedalCount} from "../methods/methodsClass.jsx";
import React from "react";

const labels = [
    'Easy',
    'Medium',
    'Hard '
];

export default function BarChartComponent({
                                              title,
                                              easyTests,
                                              mediumTests,
                                              hardTests
                                          }) {

    const testData = [easyTests.length, mediumTests.length, hardTests.length];
    const medalData = [getMedalCount(easyTests, "bronze"), getMedalCount(mediumTests, "silver"), getMedalCount(hardTests, "gold")];

    return (
        <div className="flex flex-col w-[100%] text-center">
            <h1 className = "text-white font-bold text-3xl mb-10">{title}</h1>
            <Box sx={{ width: '100%', height: 300 }}>
                <BarChart
                    sx={{
                    '& .MuiChartsLegend-root': {
                        color: 'white',
                    },
                    }}
                    series={[
                      { data: testData, label: 'Testy', id: 'pvId', color: "var(--main-color-orange)" },
                      { data: medalData, label: 'Medaily', id: 'uvId', color: "gray" },
                    ]}
                    xAxis={[{ data: labels, scaleType: "band" }]}
                    yAxis={[{ width: 50 }]}

                />
            </Box>
        </div>
    );
}
