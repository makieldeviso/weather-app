import { domElem } from "./elementCreatorScripts";
import displayMainData from "./displayMainData";
import displayHourlyForecast from "./displayHourlyForecast";
import displayDailyForecast from "./displayDailyForecast";
import { displayAstro } from "./displayAstro";

// Refreshes DOM before appending new Forecast
const refreshDisplay = () => {
    // Astro
    const astroCont = domElem('div#astro-cont');
    const astroDisplayCont = domElem('div#astro-display');
    const astroPages = document.querySelectorAll('div.astro-page');
    const astroPageChanger = document.querySelector('div#astro-page-changer');
    astroPages.forEach(node => astroDisplayCont.removeChild(node));
    if (astroPageChanger) {
        astroCont.removeChild(astroPageChanger);
    }
    

    // Hourly forecast
    const hourlyForecastCont = domElem('div#hourly-forecast-cont');
    const hourlyDisplay = domElem('div#hourly-display');
    const hourlyPages = document.querySelectorAll('div.hourly-page');
    const hourlyPageChanger = domElem('div#hourly-page-changer');
    hourlyPages.forEach(node => hourlyDisplay.removeChild(node));
    if (hourlyPageChanger) {
        hourlyForecastCont.removeChild(hourlyPageChanger);
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
    displayAstro(data);
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