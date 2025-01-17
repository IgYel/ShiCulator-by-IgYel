import { Link } from "react-router-dom";
import { useEffect } from "react";

export const makeButton = (className, setClass) =>{
    document.querySelectorAll(className).forEach((e) => {
        e.addEventListener('touchstart', (event) => {
            e.classList.add(setClass);
        });
        e.addEventListener('touchend', (event) => {
            e.classList.remove(setClass);
        });
    });
}

export const HeaderComponent = () => {
    useEffect(() =>{
        makeButton(".HeaderLink", 'click')
    });

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