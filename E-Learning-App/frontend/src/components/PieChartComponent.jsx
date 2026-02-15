import Stack from '@mui/material/Stack';
import {PieChart} from '@mui/x-charts/PieChart';
import React from "react";

export default function PieChartComponent({
                                              title = null,
                                              easyTests,
                                              mediumTests,
                                              hardTests
                                          }) {

    const data = [
        { label: 'Bronze test', value:  easyTests.length, color: '#cd7f32'},
        { label: 'Silver test', value:  mediumTests.length, color: '#C0C0C0'},
        { label: 'Gold test', value:  hardTests.length, color: '#FFD700'}
    ]

    return (
        <>
            <h1 className = "text-white font-bold text-3xl">{title}</h1>
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
