import React, { useEffect } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import {
    useNavigate,
    Outlet,
} from 'react-router-dom'

export default function FoxlinkPages({ authUser }) {
    const navigate = useNavigate();
    useEffect(() => {
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