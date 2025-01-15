import React from "react";
import ReactDOM from "react-dom/client";
import "./scss/_index.scss";
import { App } from "./App";
import { Components } from "./components/Components";
import { BrowserRouter } from "react-router-dom";
import { RouteComponent } from "./routes/RoutesComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App Components={Components} RouteComponent={RouteComponent} />
        </BrowserRouter>
    </React.StrictMode>
);
