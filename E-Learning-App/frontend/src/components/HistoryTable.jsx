import {DataGrid} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import React from "react";
import IconButton from "@mui/material/IconButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {Link} from "react-router-dom";

const columns = [
    { field: 'id', headerName: 'Poradie', width: 210, sortable: false, headerAlign: 'center', align: 'center'},
    { field: 'grade', headerName: 'Známka', width: 210, sortable: false, headerAlign: 'center', align: 'center' },
    { field: 'percentage', headerName: 'Percentá', width: 210, headerAlign: 'center', align: 'center', type: "number" },
    { field: 'medal', headerName: 'Medaila', width: 210, sortable: false, headerAlign: 'center', align: 'center'},
    {
        field: 'timestamp',
        headerName: 'Dátum',
        description: 'This column has a value getter and is not sortable.',
        width: 210,
        type: "dateTime",
        headerAlign: 'center', align: 'center'
    },
    {
        field: 'view',
        headerName: 'Náhľad',
        width: 210, sortable: false, headerAlign: 'center', align: 'center',
        renderCell: (params) => (
            <Link to = {`/test?testID=${params.row.testId}&readOnly=true`}>
                <IconButton edge="end" aria-label="accept" color = "warning">
                    <VisibilityOutlinedIcon/>
                </IconButton>
            </Link>
        ),
    }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function HistoryTable({tests}) {
    return (
        <Paper sx={{  width: '80%', position: 'relative', marginTop: 20, borderRadius: "10px", overflowX: "auto" }} >
            <h1 className="text-4xl py-3 pl-5 font-bold opacity-67 tracking-wide">História testov</h1>
            <DataGrid rows={tests.map((test, index) => ({
                id: index+1,
                percentage: test.percentage,
                grade: test.grade,
                medal: test.medal,
                timestamp: new Date(test.timestamp),
                testId: test.testId
                }))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                sx={{
                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: 18, color:  "var(--main-color-orange)"},
                    "& .MuiDataGrid-row": {justifyContent: 'space-between', alignItems: 'center'},
                    borderRadius: "10px" }}

            />
        </Paper>
    );
}
