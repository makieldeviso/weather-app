import { format, parse } from "date-fns";
import { getDayForecast } from "./forecastScripts";
import { getUserSettings, getUserPref} from "./userSettings";
import { getLocalTimeOfSearched } from "./timeScript";
import { changeBackground } from "./changeConditionDisplay";
import { createPageChanger, assignHourlyPageBtnEvent } from "./changePageDisplay";

// Reusable Shorter DOM selector
const domElem  = function (selector) {
    return document.querySelector(selector);
}

// Reusable span creator
const createSpan = function (parent, assignClass, textContent) {
    const span = document.createElement('span');
    span.setAttribute('class', assignClass);
    span.textContent = textContent;

    parent.appendChild(span);
}

// Reusable weather condition icon maker 
const createCdnIcon = function ( assignClass, time, condition, iconUrl ) {
    const weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('class', assignClass);
    weatherIcon.setAttribute('alt', `${time} ${condition}`);
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('title', condition);

    return weatherIcon;
}

const displayMainData = function (data) {
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

const displayHourlyForecast = function (data) {
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
    const createHourlyDisplay = function (hourlyObj) {
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

const displayDailyForecast = function (data) {
    // data argument should receive the whole response,
    // this function is responsible with finding the daily forecast

    const dailyObjArr = [];
    for(let i = 1; i <= 2; i++) {
        // Note: free tier weatherAPI only allows forecast upto 3 days
        // [0] -> current day, [1] -> tomorrow, [2] -> 3rd day
        // Push the next 2 days forecast obj to dailyObjArr
        dailyObjArr.push(data.forecast.forecastday[i]);
    }

    const createDailyDisplay = function (dailyObj) {
        // Note: Date used is not calculated through epoch, since it creates discrepancy to change of timezone
        // epoch received is relative to client date

        const dailyObjDate = parse(dailyObj.date, 'yyyy-MM-dd', new Date());

        const dateString = format(dailyObjDate, 'MM/dd');
        const dateStringFull = format(dailyObjDate, 'MMMM d, yyyy');
        const weekDay = format(dailyObjDate, 'EEEE');

        const condition = dailyObj.day.condition.text;
        const cdnIcon = dailyObj.day.condition.icon; // src url
        const tempUnit = getUserPref('tempUnit');
        const maxTempVal = Math.round(dailyObj.day[`maxtemp_${tempUnit}`]);
        const minTempVal = Math.round(dailyObj.day[`mintemp_${tempUnit}`]);

        const dailyDisplay = document.createElement('div');
        dailyDisplay.setAttribute('class', 'daily-forecast');

        const date = document.createElement('p');
        date.setAttribute('class', 'daily-date');
        date.textContent = dateString;

        const day = document.createElement('p');
        day.setAttribute('class', 'daily-day');
        day.textContent = weekDay;

        const weatherIcon = createCdnIcon('daily-weather-icon', dateStringFull, condition, cdnIcon);

        // reusable daily daily high/low temp creator
        const createHighLow = function (assignClass, tempMaxMin) {
            const pElem = document.createElement('p');
            pElem.setAttribute('class', assignClass);

            createSpan(pElem, 'daily-num', tempMaxMin);
            createSpan(pElem, 'daily-degree', `\u00B0`);
            createSpan(pElem, 'daily-unit', `${tempUnit.toUpperCase()}`);

            return pElem;
        }

        // Executes createHighLow
        const dailyHigh = createHighLow('daily-high', maxTempVal);
        const dailyLow = createHighLow('daily-low', minTempVal);

        // Appends component to individual day forecast, 
        // then return container
        const components = [date, day, weatherIcon, dailyHigh, dailyLow];
        components.forEach(comp => dailyDisplay.appendChild(comp));
        return dailyDisplay;
    }

    // Append daily forecast to existing daily forecast container in DOM
    const dailyForecastCont = domElem('div#daily-forecast-cont');
    dailyObjArr.forEach(obj => {
        const dailyDisplay = createDailyDisplay(obj);
        dailyForecastCont.appendChild(dailyDisplay);
    });
}

// Refreshes DOM before appending new Forecast
const refreshDisplay = function () {

    // Hourly forecast
    const hourlyForecastCont = domElem('div#hourly-forecast-cont');
    const hourlyDisplay = domElem('div#hourly-display');
    const hourlyPageNodeList = document.querySelectorAll('div.hourly-page');
    const pageChanger = document.querySelector('div#hourly-page-changer');
    hourlyPageNodeList.forEach(node => hourlyDisplay.removeChild(node));
    if (pageChanger) {
        hourlyForecastCont.removeChild(pageChanger);
    }


    // Daily Forecast
    const dailyCont = domElem('div#daily-forecast-cont');
    const dailyNodeList = document.querySelectorAll('div.daily-forecast');
    dailyNodeList.forEach(node => dailyCont.removeChild(node));

}

// Consolidated function call
const displayDataToDOM = function (data) {

    // Note: refresh display first before creating new data display
    refreshDisplay();

    displayMainData(data);
    displayHourlyForecast(data);
    displayDailyForecast(data);
}

// Page On load/ No initial Data
// Note: this hides default elements on screen when the page initially loads without data from API
const hideElements = function (action) {
    const optionsBanner = document.querySelector('div#options-banner');
    const currentDisplayArea = document.querySelector('div#current-display');
    const forecastArea = document.querySelector('div#forecast-display');

    const areaComponents = [optionsBanner, currentDisplayArea, forecastArea];
    
    if (action) {
        areaComponents.forEach(component => component.classList.add('hidden'));
        
    } else {
        areaComponents.forEach(component => component.classList.remove('hidden'));
    }
    
}


export {displayMainData, displayHourlyForecast, displayDataToDOM, hideElements}