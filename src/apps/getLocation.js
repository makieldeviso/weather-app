import { getDataFromAPI } from "./getData";
import { setForecastData, getForecastData } from "./memoryHandler";
import { displayDataToDOM } from "./displayDataToDom";
import { getUserPref, setUserPref } from "./userSettings";

const locationBar = document.querySelector('input#city-search-field');
const searchBtn = document.querySelector('button#city-search-button');

// Get location from input field, then display to DOM
const getLocationWeather = async function (location) {
    
    // Check weather getLocationWeather was triggered by click or function call
    let locationVal;
    if (location.type === 'click') {
        locationVal = locationBar.value;
    } else {
        locationVal = location;
    }

    // Don't execute if locationVal is blank/ empty
    if (locationVal === '') {
        return;
    }
    
    // Get data from API using locationVal
    const forecastData = await getDataFromAPI(locationVal);
    
    if (Object.hasOwn(forecastData, 'error')) {
        console.log(forecastData.error.message);

    } else {
        // After getting data from API, save data to memoryHandler
        setForecastData(forecastData);

        // Displays data to DOM upon clicking search button
        displayDataToDOM(forecastData);

        // Update user settings and save last data to localStorage
        const updateSettings = {
            city: forecastData.location.name,
            country: forecastData.location.country,
            lastDataReceived: forecastData
        };
        setUserPref(updateSettings);
    } 

}

// Loads the default weather according to the preferences saved in local storage
const onLoadLocationWeather = function () {
    const defaultLocation = getUserPref('city');
    getLocationWeather(defaultLocation);
}


// Add event listener to search button on page load
const assignSearchBtnEvent = function () {
    searchBtn.addEventListener('click', getLocationWeather)
}

export {assignSearchBtnEvent, onLoadLocationWeather}