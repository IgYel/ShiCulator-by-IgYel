import React from "react";
import ReactDOM from "react-dom/client";
import "./scss/_index.scss";
import { App } from "./App";
import { Components } from "./components/Components";
import { RouteComponent } from "./routes/RoutesComponent";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HashRouter>
            <App Components={Components} RouteComponent={RouteComponent} />
        </HashRouter>
    </React.StrictMode>
);
