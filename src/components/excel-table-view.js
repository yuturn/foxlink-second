import React, { useState, useEffect } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Container
} from '@mui/material';

export default function ExcelTableView({ keys, datas, id2words, ...rest }) {
    const [table, setTable] = useState();

    return (
        <Table sx={{ minWidth: 1000, overflowX: 'scroll' }}>
            <TableHead sx={{ background: "#272d3a" }}>
                <TableRow >
                    {
                        id2words == null ?
                            keys.map((key, index) => {
                                return <TableCell sx={{ minWidth: "100%" }} key={index}>{key}</TableCell>
                            }) : id2words.map((key, index) => {
                                return <TableCell sx={{ minWidth: "100%" }} key={index}>{key}</TableCell>
                            })
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    datas.map((data, i) => {
                        return (
                            <TableRow key={i + 1}>
                                {
                                    keys.map((key, j) => {
                                        if(data[key] === true){
                                            return (
                                                <TableCell sx={{ minWidth: "100%" }} key={key} >
                                                    {
                                                        "是"
                                                    }
                                                </TableCell>
                                            )
                                        }else if(data[key] === false){
                                            return (
                                                <TableCell sx={{ minWidth: "100%" }} key={key} >
                                                    {
                                                        "否"
                                                    }
                                                </TableCell>
                                            )
                                        }else{
                                            return (
                                                <TableCell sx={{ minWidth: "100%" }} key={key} >
                                                    {
                                                        data[key]
                                                    }
                                                </TableCell>
                                            )
                                        }
                                    })
                                }
                            </TableRow>
                        )
                    })
                }
            </TableBody>

        </Table>
    );
}