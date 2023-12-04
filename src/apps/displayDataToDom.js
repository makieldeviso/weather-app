import { domElem } from "./elementCreatorScripts";
import displayMainData from "./displayMainData";
import displayHourlyForecast from "./displayHourlyForecast";
import displayDailyForecast from "./displayDailyForecast";

// Refreshes DOM before appending new Forecast
const refreshDisplay = () => {

    // Hourly forecast
    const hourlyForecastCont = domElem('div#hourly-forecast-cont');
    const hourlyDisplay = domElem('div#hourly-display');
    const hourlyPageNodeList = document.querySelectorAll('div.hourly-page');
    const pageChanger = domElem('div#hourly-page-changer');
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
const displayDataToDOM = (data) => {

    // Note: refresh display first before creating new data display
    refreshDisplay();

    displayMainData(data);
    displayHourlyForecast(data);
    displayDailyForecast(data);
}

// Page On load/ No initial Data
// Note: this hides default elements on screen when the page initially loads without data from API
const hideElements = (action) => {
    const optionsBanner = domElem('div#options-banner');
    const currentDisplayArea = domElem('div#current-display');
    const forecastArea = domElem('div#forecast-display');

    const areaComponents = [optionsBanner, currentDisplayArea, forecastArea];
    
    if (action) {
        areaComponents.forEach(component => component.classList.add('hidden'));
        
    } else {
        areaComponents.forEach(component => component.classList.remove('hidden'));
    }
    
}


export { displayDataToDOM, hideElements}