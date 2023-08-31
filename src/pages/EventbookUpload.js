/*
*
* This compoent is only for testing, so there is no this feature in stable release version 
*
*
*/

// import React, { useState, useEffect } from "react";

// import { styled } from '@mui/material/styles';
// import { Box, 
//     Card, 
//     CardContent, 
//     CardHeader, 
//     Divider, 
//     Typography, 
//     createTheme, 
//     ThemeProvider,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
// } from '@mui/material';

// import ExcelTableView from "../components/excel-table-view";
// import { Parameter } from "../components/parameter";

// import LoadingButton from '@mui/lab/LoadingButton';

// import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
// import {Upload} from '../icons/upload';

// import {apiEventbook, apiWorkShopList, apiProjectList, apiEventbookGet} from "../api.js";

// const darkTheme = createTheme({
//     palette: {
//         mode:'dark',
//         primary: {
//             main: '#5048E5',
//             light: '#828DF8',
//             dark: '#7582EB',
//             contrastText: '#FFFFFF'
//           },
//         background: {
//             default: '#1a1e2b',
//             paper: '#1a1e2b',
//           },
//           text: {
//             primary: '#fff',
//           }
//     },
// });

// const Input = styled('input')({
//     display: 'none',
// });

// export default function EventbookUpload({token, ...rest}) {
//     const [dataStatus, setDataStatus] = useState(" No File Chosen");
//     const [uploading, setUpload] = useState(false);
//     // init workshop
//     const [selectItem, setSelectItem] = useState("");
//     const [projectItem, setProjectItem] = useState("");
//     const [sheetItem, setSheetItem] = useState("");

//     const [workshop, setWorkshop] = useState("");
//     const [project, setProject] = useState("");
//     const [sheet, setSheet] = useState("");

//     const [keys, setKeys] = useState();
//     const [datas, setDatas] = useState();
    
//     const [processedData, setProcessedDatas] = useState();

//     const [parameter, setParameter] = useState();

//     useEffect(()=>{
//         updateData();
//     }, [])

//     const updateData = () => {
//         setWorkshop(null);
//         setProject(null);
//         setSheet(null);
//         setSelectItem(null);
//         setProjectItem(null);
//         setSheetItem(null);

//         setKeys(null);
//         setDatas(null);
//         apiWorkShopList(token).then(res => {
//             setSelectItem(res.data.map(name=>{
//                 return(<MenuItem key={name} value={name}>{name}</MenuItem>)
//             }))
//         }).catch(err => {
//         });
//     }

//     const handleWorkshopChange = (event) => {
//         setWorkshop(event.target.value);
//         //fetchData(event.target.value);
//         let data = {
//             workshopname:event.target.value,
//             token: token
//         }
//         apiProjectList(data).then(res=>{
//             setProjectItem(res.data.map(name=>{
//                 return(<MenuItem key={name} value={name}>{name}</MenuItem>)
//             }))
//         }).catch(err=>{
//             console.log(err);
//         });
//     }

//     const handleProjectChange = (event) => {
//         setProject(event.target.value);
//         // get data
//         let data = {};
//         data['token'] = token;
//         data['project'] = event.target.value;
//         data['workshop'] = workshop;
//         apiEventbookGet(data).then(res=>{
//             let keys = ["category", "message", "priority"];
//             setKeys(keys);
//             // processing the data
//             let processed_datas = {}
//             res.data.map(obj => {
//                 obj['devices'].map(device => {
//                     if(processed_datas[device.device_name] == null){
//                         processed_datas[device.device_name] = []
//                     } 
//                     processed_datas[device.device_name].push(
//                         {
//                             "category": obj["category"],
//                             "message" : obj["message"],
//                             "priority":obj["priority"]
//                         }
//                     )
//                 })
//             })
//             setSheetItem(Object.keys(processed_datas).map(key=>{
//                 return(<MenuItem key={key} value={key}>{key}</MenuItem>)
//             }))
//             setProcessedDatas(processed_datas);
//         }).catch(err => {
//             console.log(err);
//         })
        
//     }

//     const handleSheetChange = (event) => {
//         setSheet(event.target.value);
//         setDatas(processedData[event.target.value])
//     }

//     const handleFileChange = (e) => {
//         if(e.target.files.length > 0){
//             setDataStatus(e.target.files[0].name);
//             setUpload(true);
            
//             const file = e.target.files[0];
//             let formData = new FormData();
//             formData.append("file", file);
            
//             let data = {};
//             data['token'] = token;
//             data['file'] = formData;
            
//             apiEventbook(data).then(res=>{
//                 if(res.status === 201){
//                     setUpload(false);
//                     let rawdata = res.data.split(/\n/);
//                     let keys = [];
//                     let processed_data = []
//                     rawdata.map((line, i) => {
//                         if(i === 0) {
//                             keys = line.split(',');
//                             if(keys.length > 0){
//                                 keys[0] = 'idx';
//                             }
//                         }
//                         else{
//                             let temp = line.split(',');
//                             let obj = {};
//                             temp.map((item, j)=>{
//                                 obj[keys[j]] = temp[j];
//                             })
//                             processed_data.push(obj);
//                         }
//                     })
                    
//                     let csv_data = {
//                         'keys' : keys,
//                         'datas' : processed_data
//                     }
//                     setParameter(csv_data);
//                     updateData();
//                 }
                
//              }).catch(err => {
//                  alert("请重新上传！");
//                  updateData();
//                 //console.log(err);
//              })
//         } else {
//             setDataStatus("No File Chosen");
//         }
//     }
    
    
//     return(
//         <ThemeProvider theme={darkTheme}>
//             <Card >
//             <CardHeader title="专案 Device 事件簿上传" />
//             <Divider sx={{ borderBottomWidth: 3 }}/>
//             <CardContent>
//                 <Box
//                 sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
                    
//                 }}
//                 >
//                 <Upload fontSize="large"/>
//                 </Box> 
//                 <Box
//                 sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     pt: 2
//                 }}
//                 >
//                 <label htmlFor="contained-button-file">
//                     <Input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" id="contained-button-file"  onChange={handleFileChange} /> 
//                     <LoadingButton
//                         color="success" 
//                         variant="contained" 
//                         size="large" 
//                         component="span" 
//                         startIcon={<CloudUploadOutlinedIcon sx={{mr:1}}/>}
//                         sx={{
//                             borderRadius: 4,
//                             minWidth: 200,
//                             justifyContent: 'center',
//                             letterSpacing: 3,
//                         }}
//                         type="input"
//                         loading={uploading}
//                         >
//                         {
//                             uploading ? "上传中..." : "选择档案"
//                         }
//                     </LoadingButton>
//                 </label>
//                 </Box>
//                 <Box
//                 sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     pt: 2
//                 }}
//                 >   
//                     <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                         {dataStatus}
//                     </Typography>
//                 </Box>
//                 {
//                     parameter && (
//                     <Box
//                     sx={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         pt: 2
//                     }}
//                     >
//                         <Divider sx={{ borderBottomWidth: 3 }}/>
//                         <Parameter csv_data={parameter}/>
//                     </Box>
//                     )
//                 } 
//                 <Divider sx={{ borderBottomWidth: 3, m: 3 }}/>
//                 {
//                     selectItem && 
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             justifyContent: 'center',
//                             m: 2
//                         }}
//                     >   
//                     <Typography sx={{m:1}}>
//                         现有资料 : 
//                     </Typography>
//                     <FormControl sx={{width:300}}>
//                         <InputLabel id="workshop-label">Workshop</InputLabel>
//                         <Select
//                             labelId="workshop-label"
//                             id="workshop-select"
//                             value={workshop == null ? '' : workshop}
//                             onChange={handleWorkshopChange}
//                         >
//                             {
//                                 selectItem
//                             }
//                         </Select>
//                     </FormControl >
//                     {
//                         projectItem && 
//                         <FormControl sx={{width:200}}>
//                             <InputLabel id="project-label">Project</InputLabel>
//                             <Select
//                                 labelId="project-label"
//                                 id="project-select"
//                                 value={project == null ? '' : project}
//                                 onChange={handleProjectChange}
//                             >
//                                 {
//                                     projectItem
//                                 }
//                             </Select>
//                         </FormControl>
//                     }
//                     {
//                         sheetItem && 
//                         <FormControl sx={{width:200}}>
//                             <InputLabel id="sheet-label">Device</InputLabel>
//                             <Select
//                                 labelId="sheet-label"
//                                 id="sheet-select"
//                                 value={sheet == null ? '' : sheet}
//                                 onChange={handleSheetChange}
//                             >
//                                 {
//                                     sheetItem
//                                 }
//                             </Select>
//                         </FormControl>
//                     }
//                     </Box> 
//                 }
//                 <Box>
//                     {
//                         keys && sheet && datas && 
//                         <ExcelTableView keys={keys} datas={datas}/>
//                     }
//                 </Box>
//             </CardContent>
//             </Card>
//         </ThemeProvider>
//         )
// }