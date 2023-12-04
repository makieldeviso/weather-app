import { getUserSettings } from "./userSettings";
import { domElem } from "./elementCreatorScripts";
import { changeBackground } from "./changeConditionDisplay";
import { getLocalTimeOfSearched } from "./timeScript";
import { getDayForecast } from "./forecastScripts";

const displayMainData =  (data) => {
    const forecastData = data;
    const timeZoneId = data.location.tz_id;
    const userSettings = getUserSettings();
    const {tempUnit, precipUnit, windUnit} = userSettings;

    changeBackground(forecastData);
    // DOM elements
    const cityName = domElem('p#city span#city-text');
    const countryName = domElem('p#country');
    const mainDate = domElem('p#date');
    const mainTempHero = domElem('p#main-temp');
    const tempUnits = document.querySelectorAll('span.units');
    const condition = domElem('p#main-condition');
    const mainTempHigh = domElem('p#main-high-temp span.temp');
    const mainTempLow = domElem('p#main-low-temp span.temp');
    const precipStat = domElem('div#stat-precip p.stat-num');
    const precipStatUnit = domElem('div#stat-precip p.stat-unit');
    const humidStat = domElem('div#stat-humid p.stat-num');
    const windStat = domElem('div#stat-wind p.stat-num');
    const windStatUnit = domElem('div#stat-wind p.stat-unit');
    const windStatDir = domElem('div#stat-wind p.wind-dir');
    const titleLogo =  domElem('img#website-icon');

    // Value
    const locationName = forecastData.location.name;
    const locationCountry = forecastData.location.country;
    const todayDate = getLocalTimeOfSearched(data, timeZoneId, 'day_date');
    const mainTempHeroVal = forecastData.current[`temp_${tempUnit}`];
    const conditionVal = forecastData.current.condition.text;
    const mainTempHighVal = getDayForecast(forecastData, 0, 'day')[`maxtemp_${tempUnit}`];
    const mainTempLowVal = getDayForecast(forecastData, 0, 'day')[`mintemp_${tempUnit}`];
    const precipVal = forecastData.current[`precip_${precipUnit}`];
    const humidVal = forecastData.current.humidity;
    const windVal = forecastData.current[`wind_${windUnit}`];
    const windDir = forecastData.current.wind_dir;
    const mainCondition = forecastData.current.condition.icon;
    
    // Assign values/text to DOM elements
    cityName.textContent = locationName;
    countryName.textContent = locationCountry;
    mainDate.textContent = todayDate;

    mainTempHero.textContent = `${Math.round(mainTempHeroVal)}`;

    condition.textContent = conditionVal;

    mainTempHigh.textContent = `${Math.round(mainTempHighVal)}`;
    mainTempLow.textContent = `${Math.round(mainTempLowVal)}`;
    tempUnits.forEach(span => {
        const unitSpan = span;
        unitSpan.textContent = tempUnit.toUpperCase()
    });

    precipStat.textContent = precipVal;
    precipStatUnit.textContent = precipUnit;

    humidStat.textContent = humidVal;

    windStat.textContent = windVal;
    windStatUnit.textContent = windUnit;
    windStatDir.textContent = windDir;

    // Sets website logo dynamic to weather condition
    titleLogo.setAttribute('src', mainCondition);
}

export default displayMainData