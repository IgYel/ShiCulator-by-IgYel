import { useState, useEffect} from "react";
import { makeButton } from "../../components/Header/HeaderComponent";

const shopsHours = require('../../shopsHours.json');
const shopsBonus = require('../../shopBonus.json');

const Display = (className, value) =>{
    document.querySelectorAll(className).forEach((e) =>{
         e.style.display = value;
    });
}
//! Today Date
const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); //Day
    const month = String(today.getMonth() + 1); //Month
    return `${day}.${month}`; //result (dd.m)
};
const Today = getTodayDate();

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
};

//! local storage

const saveToLs = (array) => {
    if (Array.isArray(array)) {
        localStorage.setItem('shiftsList', JSON.stringify(array));
        console.log('copied');
    } else {
        console.error('try to send not correct data', array);
    }
};

const getFromLs = () => {
    const data = localStorage.getItem('shiftsList');
    return data ? JSON.parse(data) : [];
};

//! Bonus auto counting

const countBonus = (shop, trzba) => {
  if (!shopsBonus[shop]) return 0;
  
  let bonuses = shopsBonus[shop];
  let bestBonus = 0;

  for (let bonus of bonuses) {
      if (trzba >= bonus.min) {
          bestBonus = bonus.bonus || (trzba / 100 * bonus.percent);
      }
  }

  return bestBonus;
};

//! dayOfWeekFunction

const isWorkday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        return 'work';
    } else {
        return 'dayOff';
    }
};

const getHours = (shop) => {
    if (isWorkday() === 'work') {
        const hours = shopsHours[shop];
        return hours ? hours[0] : null;
    }
    else {
        const hours = shopsHours[shop];
        return hours ? hours[1] : null;
    }
};

//! calculations
export const CalcShift = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [shop, setShop] = useState();
  
  const [defaultShop, setDefaultShop] = useState(localStorage.getItem("defaultShop") || "noDefault");

  const [shopSelect, setShopSelect] = useState(defaultShop);
  
  const [trzba, setTrzba] = useState("");
  const [bonus, setBonus] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const setDefaultShopFunction = () =>{
    const setDefShop = document.querySelector('#setDefShop');
    setDefShop.style.display = "none"

    if(defaultShop !== "noDefault"){
      localStorage.setItem("defaultShop", defaultShop)
    } else{
      localStorage.setItem("defaultShop", "2smena")
    }
  }
  
  useEffect(() => { //check if defaultShop set
    if(defaultShop == "noDefault"){
      const setDefShop = document.querySelector('#setDefShop');
      setDefShop.style.display = "block"
    }
  });

  const handleCustomSubmit = (event) => {
    event.preventDefault();
    const msg = `
${Today}, 
hours: ${end - start},
${shop}, 
______________
trzba: ${trzba}`;

const lsMsg = {
    date: Today,
    hours: end - start,
    shop: shop,
    trzba: trzba,
    bonus: bonus
}

    copyToClipboard(msg)

    //* save to LS

    const shiftsList = getFromLs();
    shiftsList.push(lsMsg)
    saveToLs(shiftsList);
  };
  
  const handleNormalSubmit = (event) => {
    event.preventDefault();
    const hours = getHours(document.querySelector('#ShopNormal').value);
    
    const shop = shopSelect; // Добавляем shop из shopSelect
    const bonus = countBonus(shop, trzba); // Вызываем функцию с нужными аргументами
    
    const msg = `
${Today}
hours: ${hours}
${shop},
______________
trzba: ${trzba}
bonus: ${bonus}
Hezky vecer!`;

    const lsMsg = {
        date: Today,
        hours: hours,
        shop: shop,
        trzba: trzba,
        bonus: bonus
    };

    copyToClipboard(msg);

    //* save to LS
    const shiftsList = getFromLs();
    shiftsList.push(lsMsg);
    saveToLs(shiftsList);
  };

  useEffect(() => {
    if (isCustomMode) {
        Display("#NormalMode", "none");
        Display("#CustomMode", "block");
    } else {
        Display("#NormalMode", "block");
        Display("#CustomMode", "none");
    }
  }, [isCustomMode]);

  useEffect(() =>{
    makeButton('.submit', 'active');
  })

  useEffect(() =>{
    const TrzbaInput = document.querySelector('#TrzbaInput');
    TrzbaInput.style.display = "none"

    if(shopSelect === "2smena"){
      const TrzbaInput = document.querySelector('#TrzbaInput');
      TrzbaInput.style.display = "none"
    } else{
      const TrzbaInput = document.querySelector('#TrzbaInput');
      TrzbaInput.style.display = "block"
    } 
  })
  
  //!   HTML

  return (
    <section className="CalcShift">
      <h1 className="Title">Calculate today's Shift</h1>

      <div id="ModeSelector">
        <div id="ModeLabel">
          custom mode
        </div>

        <input 
        id="ModeSwitch" 
        type="checkbox"
        checked={isCustomMode}
        onChange={(e) => setIsCustomMode(e.target.checked)}/>
      </div>

      {/*! Normal mode */}

      <div id="NormalMode">
        <form onSubmit={handleNormalSubmit}>
          <select
          id="ShopNormal"
          value={shopSelect}
          onChange={(e) => setShopSelect(e.target.value)}>
            <option value="2smena">2 smena (2nd shift)</option>
            <option value="Ce26">Celetna 26</option>
            <option value="Ha20">Havelska 20</option>
            <option value="Ha18">Havelska 18</option>
            <option value="Maj">Maj</option>
          </select>
  
          <input
              id="TrzbaInput"
              placeholder="Your trzba"
              type="number"
              value={trzba}
              onChange={(e) => setTrzba(e.target.value)}
            />
          <input className="submit" type="submit" value="save shift" />
        </form>
      </div>

      {/*! Custom mode */}

      <div id="CustomMode">
        <form onSubmit={handleCustomSubmit}>
          <input
            placeholder="start Hrs"
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <input
            placeholder="end Hrs"
            type="text"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
          <input
            placeholder="shop name"
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          />
          <input
            id="TrzbaInputCustom"
            placeholder="Your trzba"
            type="number"
            value={trzba}
            onChange={(e) => setTrzba(e.target.value)}
          />
          <input
            id="bonus"
            placeholder="bonus"
            type="number"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
          />
          <input className="submit" type="submit" value="save shift" />
        </form>
      </div>

      <div id="setDefShop">
        <div id="backgroundDefShop"></div>
        <div id="Content">
        <p>
          Set the shop,
          where you work 
          most of the time
          <br />
          (To save you time)
        </p>
        <form onSubmit={setDefaultShopFunction}>

          <select 
          onChange={(e) => setDefaultShop(e.target.value)}
          id="selectDefaultShop">
            <option value="2smena">2 smena (2nd shift)</option>
            <option value="Ce26">Celetna 26</option>
            <option value="Ha20">Havelska 20</option>
            <option value="Ha18">Havelska 18</option>
            <option value="Maj">Maj</option>
          </select>
  
          <input type="submit" className="submit" value="save default shop"/>
        </form>
        </div>
      </div>
    </section>
  );
};