import { Link } from "react-router-dom";

export const HeaderComponent = () => {
    return <header className="Header">
        <ul>
            <li className="HeaderButton">
                <Link className="HeaderLink" to="/Shift">Calculate Shift</Link>
            </li>
            <li className="HeaderButton">
                <Link className="HeaderLink" to="/Month">Calculate Month</Link>
            </li>
        </ul>
    </header>;
};
