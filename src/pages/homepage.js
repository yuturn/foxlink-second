import React, { useEffect } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import {
    useNavigate,
    Outlet,
} from 'react-router-dom'

export default function FoxlinkPages({ authUser }) {
    const navigate = useNavigate();
    useEffect(() => {
        // if ("$5$rounds=10000$F0XL1NKPWDHaSH$x7OJPMIuQs3XFigY6rsIzhYVDezZa0i3O1qZrDemcm5") {
        //     // pass
        // } else {
        //     navigate('404-not-found');
        // }
        if (authUser.token) {
            // pass
        } else {
            navigate('404-not-found');
        }
    }, []);
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}