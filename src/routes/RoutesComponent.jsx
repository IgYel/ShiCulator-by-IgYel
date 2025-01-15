import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { RouteComponents } from "../routeComponents/routeComponents";

const { CalcMonth, CalcShift } = RouteComponents;

export const RouteComponent = () =>{
    return(
        <Routes>
            <Route path="/" element={<CalcShift />}></Route>

            <Route path="/Shift" element={<CalcShift />}></Route>
            <Route path="/Month" element={<CalcMonth />}></Route>
        </Routes>
    )
}