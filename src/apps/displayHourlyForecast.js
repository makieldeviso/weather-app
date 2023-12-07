import { convertTimeFormat, getLocalTimeOfSearched } from "./timeScript";
import { getUserPref } from "./userSettings";
import { createCdnIcon, createSpan, domElem } from "./elementCreatorScripts";
import { createPageChanger, assignPageBtnEvent, defaultChangerStatus } from "./changePageDisplay";

const assignHourlyResize = function () {

    // Detects wether screen size is more or less than 1024px then 
    // Hide or show page changer depending on layout
    // Translate hourly pages back to origina
    const showPageChanger = function () {
        const pageWidth = window.innerWidth;

        // Note: Page changer in astro display does not become hidden
        const pageChanger = document.querySelector('div#hourly-page-changer');
        
        if (pageWidth < 1024) {
            pageChanger.classList.add('hidden');
            defaultChangerStatus('hourly');
        } else {
            pageChanger.classList.remove('hidden');
            defaultChangerStatus('hourly');
        }
    }

    window.addEventListener('load', showPageChanger);
    window.addEventListener('resize', showPageChanger);
}

const displayHourlyForecast = (data) => {
    // data argument should receive the whole response,
    // this function is responsible with finding the hourly forecast
    const timeZoneId = data.location.tz_id;
    const currentHour = getLocalTimeOfSearched(data, timeZoneId, 'current_hour');

    const currentHourlyData = data.forecast.forecastday[0].hour;
    const tomHourlyData = data.forecast.forecastday[1].hour;
    const hourlyObjArr = [];

    let nextDayFirstHourIndex = 0; // Plot the index where the next day starts
    // Pushes hourly forecast to hourlyObjArr from next hour of current hour until end of current day
    for (let i =( currentHour + 1 ); i < currentHourlyData.length; i++) {
        hourlyObjArr.push(currentHourlyData[i]);

        nextDayFirstHourIndex += 1; // Plot the index where the next day starts
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
        const userTimeFormat = getUserPref('timeFormat');
        const newHour = getLocalTimeOfSearched(hourlyObj, timeZoneId, 'hour_minute'); // time in string 00:00 format
        let hourString = convertTimeFormat(newHour, userTimeFormat); // Formatted according to user preference

        // simplify hourString if 12hr format (e.g 3 PM, 1 AM);
        if (userTimeFormat === 'hr-12') {
            hourString = convertTimeFormat(hourString, 'hr-12-simplify');
        }

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
    // Note: allForecastCont is divided into 3 pages with equal number of forecasts each
    const allForecastCont = domElem('div#hourly-display');
    const hourlyPages = 3;
    const forecastPerPage = 24 / hourlyPages;
    allForecastCont.dataset.page = 1;

    for (let i = 0; i < hourlyPages; i++) {
        const hourlyPage = document.createElement('div');
        hourlyPage.setAttribute('class', 'hourly-page');
        hourlyPage.setAttribute('id', `hourly-page-${i + 1}`);

            for (let j = (i * forecastPerPage); j <= (i + ((i + 1) * (forecastPerPage - 1))); j++) {
                const hourlyDisplay = createHourlyDisplay(hourlyObjArr[j]);

                // Add additional class attribute to hourly forecast that occurs tomorrow day
                if (j >= nextDayFirstHourIndex) {
                    hourlyDisplay.classList.add('tomorrow');
                }
                
                hourlyPage.appendChild(hourlyDisplay);
            }

        allForecastCont.appendChild(hourlyPage);
    }

    // Create page changer 
    const hourlyForecastCont = domElem('div#hourly-forecast-cont');
    const pageChanger = createPageChanger('hourly', hourlyPages,);
    hourlyForecastCont.appendChild(pageChanger);

    // Assign required event listeners
    assignPageBtnEvent('hourly');
    assignHourlyResize();

}

export default displayHourlyForecast