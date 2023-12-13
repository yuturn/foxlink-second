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
import Machinehealth from "./Machinehealth";
import LOG from "./LOG";
import Backup from "./Backup";
import Consumables from "./Consumables";
import Project from "./Project";
import SignUp from "./Signup"
import Comparison from "./Comparison"
import { NotFound } from "./404";
import { GlobalProvider } from '../components/GlobalContext';

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
            <GlobalProvider>
                <SnackbarAlert open={alert.open} message={alert.msg} type={alert.type} setAlert={setAlert} duration={alert.duration} />
                <Router>
                    <Routes>
                        <Route element={<Login setAlert={setAlert} setUser={setAuthUser} />} path={'/login'} />
                        <Route element={<FoxlinkPages authUser={authUser} />} path={'/'}>
                            <Route element={<Status token={authUser.token} setAlert={setAlert} />} path={'/all-status'}></Route>
                            <Route element={<Machinehealth token={authUser.token} setAlert={setAlert} />} path={'/machinehealth'}></Route>
                            <Route element={<Consumables token={authUser.token} />} path={'/consumables'}></Route>
                            <Route element={<LOG token={authUser.token} />} path={'/LOG'}></Route>
                            <Route element={<Backup setAlert={setAlert} token={authUser.token} />} path={'/backup'}></Route>
                            <Route element={<Project token={authUser.token} />} path={'/Project'}></Route>
                            <Route element={<Comparison token={authUser.token} />} path={'/comparison'}></Route>
                        </Route>
                        <Route
                            path='*'
                            element={
                                <Navigate to="/login" replace />
                            }
                        />
                    </Routes>
                </Router>
            </GlobalProvider>
        </>

    )
}