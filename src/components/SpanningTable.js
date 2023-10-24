import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";

const rows1 = {
    "Latch裁切定刀": [
        {
            "require": "Device_1(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        },
        {
            "require": "Device_4(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        },
        {
            "require": "Device_6(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        }
    ],
    "刮刀": [
        {
            "require": "Device_1(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        },
        {
            "require": "Device_4(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        },
        {
            "require": "Device_6(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        },
        {
            "require": "Device_10(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        },
        {
            "require": "Device_11(尺寸,外觀)",
            "prechangtime": "2023-08-13 12:51:18",
            "lifechangetime": "2023-06-09 13:18:10",
            "lifeusedcount": 70000,
            "lifechangecount": 10,
            "lifechangeaveragecount": 65000,
            "brokenchangetime": "2023-05-23 11:42:19",
            "brokenusedcount": 70000,
            "brokenchangecount": 10,
            "brokenchangeaveragecount": 65000,
            "total": 15
        }
    ]
};

export default function SpanningTable({ data }) {
    // 计算所有设备数据数组的总长度
    const totalLength = Object.values(rows1).reduce((acc, data) => acc + data.length, 0);

    // 根据总长度设置 spacing
    const spacing = totalLength <= 4 ? 4 : 10;
    return (
        <div>
            <Grid container spacing={spacing}>
                {Object.keys(rows1).map((equipment) => (
                    <Grid item key={equipment} xs={12} md={6} lg={3}>
                        {rows1[equipment].map((info) => (
                            <TableContainer key={info.require} component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={5}
                                                sx={{
                                                    backgroundColor: "#b3e5fc",
                                                    border: "1px solid black"
                                                }}
                                            >
                                                {equipment}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                                                設備需求
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                colSpan={3}
                                                sx={{ border: "1px solid black" }}
                                            >
                                                {info.require}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                colSpan={2}
                                                sx={{
                                                    backgroundColor: "orange",
                                                    border: "1px solid black"
                                                }}
                                            >
                                                預計下周更換時間
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                sx={{
                                                    backgroundColor: "orange",
                                                    border: "1px solid black"
                                                }}
                                                colSpan={3}
                                            >
                                                {info.prechangtime}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                更換原因
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                更換時間
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                本次使用次數
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                累計更換次數
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                平均使用次數
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                壽命更換
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                {info.lifechangetime}
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                {info.lifeusedcount}
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                {info.lifechangecount}
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                {info.lifechangeaveragecount}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ border: "1px solid black" }}>
                                                不良更換
                                            </TableCell>
                                            <TableCell sx={{ border: "1px solid black" }}>
                                                {info.brokenchangetime}
                                            </TableCell>
                                            <TableCell sx={{ border: "1px solid black" }}>
                                                {info.brokenusedcount}
                                            </TableCell>
                                            <TableCell sx={{ border: "1px solid black" }}>
                                                {info.brokenchangecount}
                                            </TableCell>
                                            <TableCell sx={{ border: "1px solid black" }}>
                                                {info.brokenchangeaveragecount}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={3}
                                                sx={{
                                                    backgroundColor: "#c8e6c9",
                                                    border: "1px solid black"
                                                }}
                                            >
                                                總計
                                            </TableCell>
                                            <TableCell
                                                colSpan={2}
                                                sx={{
                                                    backgroundColor: "#c8e6c9",
                                                    border: "1px solid black"
                                                }}
                                            >
                                                {info.total}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
