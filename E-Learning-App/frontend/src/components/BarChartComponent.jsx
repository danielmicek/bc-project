import Box from '@mui/material/Box';
import {BarChart} from '@mui/x-charts/BarChart';
import {getMedalCount} from "../methods/methodsClass.js";
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

// if no tests - chart will be only for illustration
    const NO_TESTS = easyTests.length === 0 && mediumTests.length === 0 && hardTests.length === 0;
    const testData = [NO_TESTS ? 12 : easyTests.length, NO_TESTS ? 8 : mediumTests.length, NO_TESTS ? 3 : hardTests.length];
    const medalData = [
        NO_TESTS ? 5 : getMedalCount(easyTests, "bronze"),
        NO_TESTS ? 3 : getMedalCount(mediumTests, "silver"),
        NO_TESTS ? 1 : getMedalCount(hardTests, "gold")
    ];

    return (
        <div className="flex flex-col w-[100%] text-center">
            <h1 className = "text-white font-bold text-3xl mb-10">{title}</h1>
            {NO_TESTS && <h3 className = "text-gray-500 font-bold text-md mb-10">Žiadne testy. Graf je ilustračný</h3>}
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
