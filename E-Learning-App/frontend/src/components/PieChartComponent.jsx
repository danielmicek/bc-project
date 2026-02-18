import Stack from '@mui/material/Stack';
import {PieChart} from '@mui/x-charts/PieChart';
import React from "react";

export default function PieChartComponent({
                                              title = null,
                                              easyTests,
                                              mediumTests,
                                              hardTests
                                          }) {

    // if no tests - chart will be only for illustration
    const NO_TESTS = easyTests.length === 0 && mediumTests.length === 0 && hardTests.length === 0;
    const data = [
        { label: 'Bronze test', value:  NO_TESTS ? 12 : easyTests.length, color: '#cd7f32'},
        { label: 'Silver test', value:  NO_TESTS ? 8 : mediumTests.length, color: '#C0C0C0'},
        { label: 'Gold test', value:  NO_TESTS ? 3 : hardTests.length, color: '#FFD700'}
    ]

    return (
        <>
            <h1 className = "text-white font-bold text-3xl">{title}</h1>
            {NO_TESTS && <h3 className = "text-gray-500 font-bold text-md">Žiadne testy. Graf je ilustračný</h3>}
            <Stack width="100%" height={300} direction="row">
                <PieChart
                    series={[
                        {
                            paddingAngle: 5,
                            innerRadius: '60%',
                            outerRadius: '90%',
                            data,
                        },
                    ]}
                    hideLegend
                />
                {/*<PieChart
                series={[
                    {
                        startAngle: -90,
                        endAngle: 90,
                        paddingAngle: 5,
                        innerRadius: '60%',
                        outerRadius: '90%',
                        data,
                    },
                ]}
                hideLegend
            />*/}
            </Stack>
        </>
    );
}
