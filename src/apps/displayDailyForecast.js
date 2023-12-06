import { format, parse } from "date-fns";
import { getUserPref } from "./userSettings";
import { createCdnIcon, createSpan, domElem } from "./elementCreatorScripts";

const displayDailyForecast = (data) => {
    // data argument should receive the whole response,
    // this function is responsible with finding the daily forecast

    const dailyObjArr = [];
    for(let i = 1; i <= 2; i++) {
        // Note: free tier weatherAPI only allows forecast upto 3 days
        // [0] -> current day, [1] -> tomorrow, [2] -> 3rd day
        // Push the next 2 days forecast obj to dailyObjArr
        dailyObjArr.push(data.forecast.forecastday[i]);
    }

    const createDailyForecast = (dailyObj) => {
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

        const dailyForecast = document.createElement('div');
        dailyForecast.setAttribute('class', 'daily-forecast');

        const date = document.createElement('p');
        date.setAttribute('class', 'daily-date');
        date.textContent = dateString;

        const day = document.createElement('p');
        day.setAttribute('class', 'daily-day');
        day.textContent = weekDay;

        const weatherIcon = createCdnIcon('daily-weather-icon', dateStringFull, condition, cdnIcon);

        // reusable daily daily high/low temp creator
        const createHighLow = (assignClass, tempMaxMin) => {
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
        components.forEach(comp => dailyForecast.appendChild(comp));
        return dailyForecast;
    }

    // Append daily forecast to existing daily forecast container in DOM
    const dailyDisplayCont = domElem('div#daily-display');
    dailyObjArr.forEach(obj => {
        const dailyForecast = createDailyForecast(obj);
        dailyDisplayCont.appendChild(dailyForecast);
    });
}

export default displayDailyForecast