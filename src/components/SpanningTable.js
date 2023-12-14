import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from '../components/GlobalContext';
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
    ],
    "刮刀1": [
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
        }
    ],
    "刮刀2": [
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
        }
    ]
};

export default function SpanningTable({ data }) {
    // 将所有表格数据展平为一个数组
    const flattenedData = [];
    Object.keys(rows1).forEach((equipment) => {
        rows1[equipment].forEach((info) => {
            flattenedData.push({ equipment, ...info });
        });
    });

    const { globalVariable, updateGlobalVariable } = useContext(GlobalContext);
    return (
        <div>
            {globalVariable == "zh-tw" ? (
                <Grid container spacing={10}>
                    {flattenedData.map((info, index) => (
                        <Grid item key={info.require} xs={4}>
                            <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                                <Table aria-label="spanning table">
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
                                                {info.equipment}
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
                        </Grid>
                    ))}
                </Grid>
            ) : globalVariable == "zh-cn" ? (
                <Grid container spacing={10}>
                    {flattenedData.map((info, index) => (
                        <Grid item key={info.require} xs={4}>
                            <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                                <Table aria-label="spanning table">
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
                                                {info.equipment}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                                                设备需求
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
                                                预计下周更换时间
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
                                                更换原因
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                更换时间
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                本次使用次数
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                累计更换次数
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                平均使用次数
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                寿命更换
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
                                                总计
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
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={10}>
                    {flattenedData.map((info, index) => (
                        <Grid item key={info.require} xs={4}>
                            <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                                <Table aria-label="spanning table">
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
                                                {info.equipment}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                                                Equipment requirements
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
                                                Estimated replacement time next week
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
                                                Reason for replacement
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                Replacement time
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                Number of times used this time
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                Cumulative number of replacements
                                            </TableCell>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                Average number of uses
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={1} sx={{ border: "1px solid black" }}>
                                                Life replacement
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
                                                Bad replacement
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
                                                Total
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
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}