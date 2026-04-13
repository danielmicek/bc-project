import {DataGrid} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import React from "react";
import IconButton from "@mui/material/IconButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {Link} from "react-router-dom";

const columns = [
    { field: 'id', headerName: 'Poradie', width: 210, sortable: false, headerAlign: 'center', align: 'center'},
    { field: 'grade', headerName: 'Znamka', width: 210, sortable: false, headerAlign: 'center', align: 'center' },
    { field: 'percentage', headerName: 'Percenta', width: 210, headerAlign: 'center', align: 'center', type: "number" },
    { field: 'medal', headerName: 'Medaila', width: 210, sortable: false, headerAlign: 'center', align: 'center'},
    {
        field: 'timestamp',
        headerName: 'Datum',
        description: 'This column has a value getter and is not sortable.',
        width: 210,
        type: "dateTime",
        headerAlign: 'center', align: 'center'
    },
    {
        field: 'view',
        headerName: 'Nahlad',
        width: 210, sortable: false, headerAlign: 'center', align: 'center',
        renderCell: (params) => (
            <Link to={`/test?testID=${params.row.testId}&readOnly=true`}>
                <IconButton edge="end" aria-label="accept" color="warning">
                    <VisibilityOutlinedIcon/>
                </IconButton>
            </Link>
        ),
    }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function HistoryTable({tests}) {
    return (
        <Paper
            id="HISTORY_TABLE"
            className="flex h-[420px] w-full flex-col overflow-hidden rounded-[10px]"
            sx={{ position: 'relative', borderRadius: '10px' }}
        >
            <h1 className="py-3 pl-5 text-4xl font-bold tracking-wide opacity-67">História testov</h1>
            <div className="min-h-0 flex-1">
                <DataGrid
                    rows={tests.map((test, index) => ({
                        id: index + 1,
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
                        height: '100%',
                        borderRadius: '10px',
                        '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: 18, color: "var(--main-color-orange)"},
                        "& .MuiDataGrid-row": { justifyContent: 'space-between', alignItems: 'center' },
                        '& .MuiDataGrid-topContainer': { borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }
                    }}
                />
            </div>
        </Paper>
    );
}
