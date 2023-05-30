import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'

import Login from './LoginPage';
import FoxlinkPages from './homepage';
import SnackbarAlert from "./Snackbar";
import Status from "./AllStatus";
import Statistics from "./Statistics";
import QrcodeDownload from "./Qrcode";
import Map from "./Map";
import DevicesUpload from "./DevicesUpload";
import WorkerinfoUpload from "./WorkinfoUpload";
import MapUpload from "./MapUpload";
import WhiteList from "./WhiteList";
import ENRMission from "./OtherMission";
import { NotFound } from "./404";

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

export default function App() {

    const [alert, setAlert] = useState({
        'open': false,
        'type': '',
        'msg': '',
        'duration': 3000
    })
    // user auth
    const [authUser, setAuthUser] = useState({
        'token': null,
        'token_type': null,
        'username': null,
        'level': null,
    })

    return (
        <>
            <SnackbarAlert open={alert.open} message={alert.msg} type={alert.type} setAlert={setAlert} duration={alert.duration} />
            <Router>
                <Routes>
                    {/* <Route element={<Login setAlert={setAlert} setUser={setAuthUser} />} path={'/login'}></Route>
                    <Route element={<FoxlinkPages authUser={authUser} />} path={'/'}>
                        <Route element={<Status token={authUser.token} setAlert={setAlert} />} path={'/all-status'}></Route>
                        <Route element={<WorkerinfoUpload setAlert={setAlert} token={authUser.token} />} path={'/worker-info-upload'}></Route>
                        <Route element={<DevicesUpload token={authUser.token} />} path={'/devices-upload'}></Route>
                        <Route element={<Statistics token={authUser.token} setAlert={setAlert} />} path={'/statistics'}></Route>
                        <Route element={<QrcodeDownload token={authUser.token} />} path={'/qrcode-download'}></Route>
                        <Route element={<Map setAlert={setAlert} token={authUser.token} />} path={'/map'}></Route>
                        <Route element={<MapUpload token={authUser.token} />} path={'/map-upload'}></Route>
                        <Route element={<WhiteList token={authUser.token} />} path={'/white-list'}></Route>
                        <Route element={<ENRMission token={authUser.token} />} path={'/ENRMission'}></Route>
                    </Route> */}
                    <Route element={<FoxlinkPages />} path={'/'}>
                        <Route element={<WorkerinfoUpload setAlert={setAlert} />} path={'/worker-info-upload'}></Route>
                        <Route element={<DevicesUpload />} path={'/devices-upload'}></Route>
                        <Route element={<Statistics setAlert={setAlert} />} path={'/statistics'}></Route>
                        <Route element={<QrcodeDownload />} path={'/qrcode-download'}></Route>
                        <Route element={<Map setAlert={setAlert} />} path={'/map'}></Route>
                        <Route element={<MapUpload />} path={'/map-upload'}></Route>
                        <Route element={<WhiteList />} path={'/white-list'}></Route>
                        <Route element={<ENRMission />} path={'/ENRMission'}></Route>
                    </Route>

                    {/* <Route
                        path='*'
                        element={
                            <Navigate to="/login" replace />
                        }
                    /> */}
                </Routes>
            </Router>
        </>

    )
}