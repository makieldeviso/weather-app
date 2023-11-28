
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

// const setUserPref = function (property) {
//     const userSettings = localStorage.


//     localStorage.setItem(property, )
// }

export {setInitial, getUserSettings, getUserPref}