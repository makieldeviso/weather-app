import { getDataFromAPI } from "./getData";
import { setForecastData } from "./memoryHandler";
import { displayDataToDOM, hideElements } from "./displayDataToDom";
import { getUserPref, setUserPref } from "./userSettings";
import { loadSpinner } from "./addLoadingScreen";
import { showAlertMessage } from "./showAlertMessage";

const locationBar = document.querySelector('input#city-search-field');
const searchBtn = document.querySelector('button#city-search-button');

// Get location from input field, then display to DOM
const getLocationWeather = async function (location) {
    // Check weather getLocationWeather was triggered by click or function call
    let locationVal;
    if (location.type === 'click' || location === 'Enter') {
        locationVal = locationBar.value;
    } else {
        locationVal = location;
    }

    // Don't execute if locationVal is blank/ empty
    if (locationVal === '') {
        return;
    }
    
    // Add load spinner/ loading screen
    // Note: load and remove upon api fetch
    loadSpinner(true);

    // Get data from API using locationVal
    const forecastData = await getDataFromAPI(locationVal);
    
    // Add load spinner/ loading screen
    loadSpinner(false);

    if (Object.hasOwn(forecastData, 'error')) {
        showAlertMessage(forecastData);
        setUserPref({errorFound: true});

    } else {
        // After getting data from API, save data to memoryHandler
        setForecastData(forecastData);

        // Displays data to DOM upon clicking search button
        displayDataToDOM(forecastData);

        // Update user settings and save last data to localStorage
        const updateSettings = {
            city: forecastData.location.name,
            country: forecastData.location.country,
            lastDataReceived: forecastData,
            errorFound: false
        };
        setUserPref(updateSettings);
    } 

}

// Loads the default weather according to the preferences saved in local storage
const onLoadLocationWeather = async function () {
    const defaultLocation = getUserPref('city');

    // hides element on load if no data yet, then revert visibility after api call
    hideElements(true); // hide
    
    // Fetch and display data to DOM
    // Note: getLocationWeather executes displayDataToDOM
    await getLocationWeather(defaultLocation); // async/ fetch

    // Unhide elements previously hidden
    // if initial data fetch fails and no previous data is saved, continue hiding blank elements
    const errorFound = getUserPref(`errorFound`);
    if (errorFound && getUserPref('lastDataReceived')) {
        hideElements(false); // unhide

        const lastDataReceived = getUserPref('lastDataReceived');
        displayDataToDOM(lastDataReceived);

    } else if (!errorFound) {
        hideElements(false); // unhide
    }
}

const addEnterKeyPress = function (event) {
    const isFocus = event.type === 'focus';
    const isBlur = event.type === 'blur';

    const enterPressSearch = async function (event) {
        if (event.code === 'Enter' || event.keyCode === '13') {
            await getLocationWeather(event.code);

            // Focus out of search bar then remove eventListener
            locationBar.blur();
            document.removeEventListener('keydown', enterPressSearch);
        }
    }

    if (isFocus) {
        document.addEventListener('keydown', enterPressSearch);
    } else if (isBlur) {
        document.removeEventListener('keydown', enterPressSearch);
    }
}


// Add event listener to search button on page load
const assignSearchBtnEvent = function () {
    searchBtn.addEventListener('click', getLocationWeather);
    locationBar.addEventListener('focus', addEnterKeyPress);
    locationBar.addEventListener('blur', addEnterKeyPress);
}

export {assignSearchBtnEvent, onLoadLocationWeather}