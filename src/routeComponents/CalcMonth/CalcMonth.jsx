import { useState, useEffect } from "react";
import { makeButton } from "../../components/Header/HeaderComponent";

const saveRateToLs = (newRate) => {
    localStorage.setItem("rate", JSON.stringify(newRate));
};

const getRateFromLs = () => {
    const data = localStorage.getItem("rate");
    if(!data){
        return "noData"
    }else{
        return JSON.parse(data);
    }
};

const rate = getRateFromLs();

const getFromLs = () => {
    const data = localStorage.getItem("shiftsList");
    if (!data) return [];

    return JSON.parse(data).map(shift => ({
        ...shift,
        hours: parseFloat(shift.hours) || 0, // Приводим часы к числу
        bonus: parseFloat(shift.bonus) || 0  // Приводим бонус к числу
    }));
};

const saveToLs = (shifts) => {
    localStorage.setItem("shiftsList", JSON.stringify(shifts));
};

const displayShiftsElements = () => {
    const shifts = getFromLs();
    const selectContainer = document.querySelector("#selectShift");

    if (!selectContainer) return;

    selectContainer.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Tap to select";
    defaultOption.value = "";
    selectContainer.appendChild(defaultOption);

    if (shifts.length > 0) {
        shifts.forEach((shift) => {
            const option = document.createElement("option");
            option.value = shift.date;
            option.textContent = shift.date;
            selectContainer.appendChild(option);
        });
    } else {
        const noShiftOption = document.createElement("option");
        noShiftOption.textContent = "No shifts this month";
        noShiftOption.disabled = true;
        noShiftOption.selected = true;
        selectContainer.appendChild(noShiftOption);
    }
};

export const CalcMonth = () => {
    //* useState
    const [selectedId, setSelectedId] = useState(null);
    const [date, setDate] = useState("");
    const [hours, setHours] = useState("");
    const [shop, setShop] = useState("");
    const [trzba, setTrzba] = useState("");
    const [bonus, setBonus] = useState("");

    const [rate, setRate] = useState("");

    useEffect(() =>{
        makeButton('.submit', 'active');
        makeButton('#clearLsButton', 'activeRed');
    })

    //* useEffect (заполняет селект при загрузке)
    useEffect(() => {
        displayShiftsElements();
    }, []);

    //* useEffect (обновляет state при выборе смены)
    useEffect(() => {
        if (!selectedId) return;

        const shifts = getFromLs();
        const selectedShift = shifts.find((shift) => shift.date === selectedId);

        if (selectedShift) {
            setDate(selectedShift.date);
            setHours(selectedShift.hours);
            setShop(selectedShift.shop);
            setTrzba(selectedShift.trzba);
            setBonus(selectedShift.bonus);
        }

        const changeShiftElement = document.querySelector("#changeShiftElement");
        if (changeShiftElement) {
            changeShiftElement.style.display = "block";
        }

        console.log("Выбранная смена:", selectedShift);
    }, [selectedId]); // Запускается при изменении selectedId

    //* Функция сохранения изменённых данных обратно в localStorage
    const saveChangedShift = (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
    
        let shifts = getFromLs();
    
        shifts = shifts.map((shift) =>
            shift.date === selectedId
                ? {
                    date,
                    hours: parseFloat(hours) || 0, // Принудительно сохраняем как число
                    shop,
                    trzba,
                    bonus: parseFloat(bonus) || 0 // Принудительно сохраняем как число
                }
                : shift
        );
    
        saveToLs(shifts); // Сохраняем обновлённые данные в localStorage
    
        console.log("Изменённая смена сохранена:", { date, hours, shop, trzba, bonus });
    
        // Обновляем селект с новыми данными
        displayShiftsElements();
    
        const changeShiftElement = document.querySelector("#changeShiftElement");
        changeShiftElement.style.display = "none";
    };

    useEffect(() =>{
        const saveRateButton = document.querySelector('#saveRateButton')
        const salaryDisplay = document.querySelector('#salaryDisplay');

        //*checkRate function
        const checkRate = getRateFromLs();
        if(checkRate !== "noData"){
            const changeRateWindow = document.querySelector('#changeRateWindow');
            changeRateWindow.style.display = "none";
        } else{};
        
        salaryDisplay.onclick = (e) =>{
            e.preventDefault()
            saveRateToLs("noData")
            const changeRateWindow = document.querySelector('#changeRateWindow');
            changeRateWindow.style.display = "block"
        }

        const clearLsButton = document.querySelector('#clearLsButton');

        clearLsButton.onclick = () =>{

            const confirmed = window.confirm(`Do you really want to clear all the shifts?? 
You will not be able to redo this action back`);

            if(confirmed){
                localStorage.removeItem("shiftsList");
                window.location.reload();
            }
        }
    })

    //* useEffect для генерации списка смен (работает всегда)
    useEffect(() => {
        const compilateMoth = document.querySelector("#compilateMoth");
    
        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                console.log("Скопировано!");
            } catch (err) {
                console.error("Ошибка копирования:", err);
            }
        }
        
        if (compilateMoth) {
            compilateMoth.onclick = () => {
                const shifts = getFromLs();
                let rate = Number(getRateFromLs());

                let compiledShifts = "";
                let totalSalary = 0;
                let totalHours = 0;
                let majHours = 0;
    
                for (let i = 0; i < shifts.length; i++) {
                    const shift = shifts[i];
    
                    let shiftHours = parseFloat(shift.hours) || 0;
                    let shiftBonus = parseFloat(shift.bonus) || 0;
                    console.log(shiftBonus)

                    let thatShift = ""
                    if(shift.bonus == 0){
                    thatShift = `
date: ${shift.date},
shop: ${shift.shop},
hours: ${shiftHours}`;
} 

else{
thatShift = `
date: ${shift.date},
shop: ${shift.shop},
hours: ${shiftHours},
bonus: ${shift.bonus}`;
}
                    totalHours += shiftHours;

                    if(shift.shop === "Maj"){
                        if (shiftBonus >= 1600) {
                            totalSalary += shift.bonus
                        }
                        else {
                            totalSalary += 1600;
                        }
                        majHours += shift.hours
                    }
                    else{
                        totalSalary += shift.bonus
                    }
    
                    compiledShifts += thatShift + "\n--------------\n";
                }

                console.log(majHours, typeof majHours)
                let finalSalary = totalSalary + (totalHours - majHours) * rate; // Финальный расчет зарплаты
    
                compiledShifts += `
    Total hours: ${totalHours}h
    Total salary: ${finalSalary} CZK`;

                navigator.clipboard.writeText(compiledShifts) //* Copy to clickboard
                copyToClipboard(compiledShifts) //* Copy to clickboard
                console.log(compiledShifts);
            };
        }
    }, []);     
    
    //* function to set new rate
    const saveRate = (e) => {

        const changeRateWindow = document.querySelector(`#changeRateWindow`);
        changeRateWindow.style.display = "none";

        saveRateToLs(rate);
    };

    let displayRate = getRateFromLs();

    return (
        <section className="CalcMonth">
            <h1 className="Title">Calculate total Month salary</h1>
            <div id="salaryDisplay">Rate: <p>{displayRate}CZK</p> / hour</div>

            <div id="changeRateWindow">
                <div id="background"></div>
                <div id="windowContent">
    
                    <p id="titleContent">enter your rate (in CZK) per hour</p>
                    <form onSubmit={ saveRate }>
                        <input
                        type="number" 
                        onChange={(e) => setRate(e.target.value)}/>
    
                        <input
                        id="saveRateButton"
                        type="submit"
                        className="submit"
                        value="save new rate"/>
                    </form>
                </div>
            </div>

            <div className="titleMonthCalc">all shifts of this month</div>

            <select id="selectShift" onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">Tap to select</option>
            </select>

            <div id="changeShiftElement" style={{ display: "none" }}>
                <p className="titleMonthCalc">Change selected shift</p>

                <form onSubmit={saveChangedShift} id="changeShiftForm">
                    <div className="inputElement">
                        <p className="label">date:</p>
                        <input type="text" placeholder="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="inputElement">
                        <p className="label">shop:</p>
                        <input type="text" placeholder="shop name" value={shop} onChange={(e) => setShop(e.target.value)} />
                    </div>

                    <div className="inputElement">
                        <p className="label">hours:</p>
                        <input type="text" placeholder="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
                    </div>

                    <div className="inputElement">
                        <p className="label">trzba:</p>
                        <input type="text" placeholder="trzba" value={trzba} onChange={(e) => setTrzba(e.target.value)} />
                    </div>

                    <div className="inputElement">
                        <p className="label">bonus:</p>
                        <input type="text" placeholder="bonus" value={bonus} onChange={(e) => setBonus(e.target.value)} />
                    </div>

                    <input type="submit" className="submit" value="Save changes" />
                </form>
            </div>

            <input 
                type="submit" 
                value="Generate shift list" 
                className="submit" 
                id="compilateMoth" 
            />

            <input 
                type="submit" 
                value="Delete all shifts" 
                className="submit" 
                id="clearLsButton" 
            />
        </section>
    );
};