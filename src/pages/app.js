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
import Health from "./Machinehealth";
import LOG from "./LOG";
import Backup from "./Backup";
import DevicesUpload from "./DevicesUpload";
import WorkerinfoUpload from "./WorkinfoUpload";
import MapUpload from "./MapUpload";
import Management from "./Management";
import Project from "./Project";
import SignUp from "./Signup"
import { NotFound } from "./404";

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
                    <Route element={<Login setAlert={setAlert} setUser={setAuthUser} />} path={'/login'}>
                        <Route element={<SignUp setAlert={setAlert} setUser={setAuthUser} />} path={'/login/signup'}></Route>
                    </Route>
                    <Route element={<FoxlinkPages authUser={authUser} />} path={'/'}>
                        <Route element={<Status token={authUser.token} setAlert={setAlert} />} path={'/all-status'}></Route>
                        <Route element={<WorkerinfoUpload setAlert={setAlert} token={authUser.token} />} path={'/worker-info-upload'}></Route>
                        <Route element={<DevicesUpload token={authUser.token} />} path={'/devices-upload'}></Route>
                        <Route element={<Health token={authUser.token} setAlert={setAlert} />} path={'/machinehealth'}></Route>
                        <Route element={<LOG token={authUser.token} />} path={'/LOG'}></Route>
                        <Route element={<Backup setAlert={setAlert} token={authUser.token} />} path={'/backup'}></Route>
                        <Route element={<MapUpload token={authUser.token} />} path={'/map-upload'}></Route>
                        <Route element={<Management token={authUser.token} />} path={'/management'}></Route>
                        <Route element={<Project token={authUser.token} />} path={'/Project'}></Route>
                    </Route>
                    <Route
                        path='*'
                        element={
                            <Navigate to="/login" replace />
                        }
                    />
                </Routes>
            </Router>
        </>

    )
}