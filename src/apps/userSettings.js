
const userDefault = function () {
    const city = 'Manila';
    const country = 'Philippines';
    const tempUnit = 'c';
    const precipUnit = 'mm';
    const windUnit = 'kph';
    const otherUnits = 'metric';

    return {city, country, tempUnit, precipUnit, windUnit, otherUnits};
}

const setInitial = function () {
    if (!localStorage.weatherAppSettings) {
        const initialDefault = JSON.stringify(userDefault());
        localStorage.setItem('weatherAppSettings', initialDefault);
    } 
}

const getUserSettings = function () {
    return JSON.parse(localStorage.weatherAppSettings);
}

const getUserPref = function (property) {
    const userSettings = JSON.parse(localStorage.weatherAppSettings);
    return userSettings[property];
}

const setUserPref = function (settingsObj) {
    // Note: settingsObj parameter receives an object with keyvalue pair
    //  to be modified to the settings
    const userSettings = getUserSettings();
    const modifiedSettings = Object.assign(userSettings, settingsObj);

    // Stringify modifiedSettings then apply changes to local Storage
    const newSettings = JSON.stringify(modifiedSettings);
    localStorage.setItem('weatherAppSettings', newSettings);

}

export {setInitial, getUserSettings, getUserPref, setUserPref}