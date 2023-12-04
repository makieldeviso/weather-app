import { getLocalTimeOfSearched } from "./timeScript";
import { getUserPref } from "./userSettings";
import { createCdnIcon, createSpan, domElem } from "./elementCreatorScripts";
import { createPageChanger, assignHourlyPageBtnEvent } from "./changePageDisplay";

const displayHourlyForecast = (data) => {
    // data argument should receive the whole response,
    // this function is responsible with finding the hourly forecast
    const timeZoneId = data.location.tz_id;
    const currentHour = getLocalTimeOfSearched(data, timeZoneId, 'current_hour');

    const currentHourlyData = data.forecast.forecastday[0].hour;
    const tomHourlyData = data.forecast.forecastday[1].hour;
    const hourlyObjArr = [];

    // Pushes hourly forecast to hourlyObjArr from next hour of current hour until end of current day
    for (let i =( currentHour + 1 ); i < currentHourlyData.length; i++) {
        hourlyObjArr.push(currentHourlyData[i]);
    }

     // Pushes hourly forecast to hourlyObjArr from start of next day until same hour of current hour
     for (let i = 0; i <= currentHour; i++) {
        hourlyObjArr.push(tomHourlyData[i]);
    }
    
    // Creates and return individual hourly forecast
    const createHourlyDisplay = (hourlyObj) => {
        // hourlyObj parameter receives individual hourly forecast object 
        // Note: timeZoneId exists in upper scope
        // const dateObj = new Date(hourlyObj.time_epoch * 1000);
        const hourString = getLocalTimeOfSearched(hourlyObj, timeZoneId, 'hour_minute'); // time in string 00:00 format
        const condition = hourlyObj.condition.text; // condition description string
        const cdnIcon = hourlyObj.condition.icon; // src url
        const tempUnit = getUserPref('tempUnit');
        const tempVal = Math.round(hourlyObj[`temp_${tempUnit}`]);

        const hourlyCont = document.createElement('div');
        hourlyCont.setAttribute('class', 'hourly-forecast');

        const time = document.createElement('p');
        time.setAttribute('class', 'hourly-time');
        time.textContent = hourString;

        const weatherIcon = createCdnIcon('hourly-weather-icon', hourString, condition, cdnIcon);

        const temp = document.createElement('p');
        temp.setAttribute('class', 'hourly-temp');

        createSpan(temp, 'hourly-num', `${tempVal}`);
        createSpan(temp, 'hourly-degree', '\u00B0');
        createSpan(temp, 'hourly-unit', `${tempUnit.toUpperCase()}`);

        const components = [time, weatherIcon, temp];
        components.forEach(comp => hourlyCont.appendChild(comp));

        return hourlyCont;
    }

    // Executes createHourlyDisplay using objects from array hourlyObjArr
    // then append to existing forecast container in DOM
    // Note: allForecastCont is divided into 3 pages with 8 forecasts each
    const allForecastCont = domElem('div#hourly-display');
    const hourlyPages = 3;
    const forecastPerPage = 8;
    allForecastCont.dataset.page = 1;

    for (let i = 0; i < hourlyPages; i++) {
        const hourlyPage = document.createElement('div');
        hourlyPage.setAttribute('class', 'hourly-page');
        hourlyPage.setAttribute('id', `hourly-page-${i + 1}`);

            for (let j = (i * forecastPerPage); j <= (i + ((i + 1) * (forecastPerPage - 1))); j++) {
                const hourlyDisplay = createHourlyDisplay(hourlyObjArr[j]);
                hourlyPage.appendChild(hourlyDisplay);
            }

        allForecastCont.appendChild(hourlyPage);
    }

    // Create page changer 
    const hourlyForecastCont = domElem('div#hourly-forecast-cont');
    const pageChanger = createPageChanger('hourly', hourlyPages,);
    hourlyForecastCont.appendChild(pageChanger);
    assignHourlyPageBtnEvent();

}

export default displayHourlyForecast