
const changeBackground = (data) => {

    const forecastData = data;
    const isDay = forecastData.current.is_day;
    const conditionCode = forecastData.current.condition.code;

    const main = document.querySelector('main');
    const conditionBg = document.querySelector('div#condition-bg');

    const clear = 1000;
    const cloudy = [1003, 1006, 1030, 1063, 1066, 1069, 1072, 1135, 1150, 1180, 1210, 1216];

    const isClear = conditionCode === clear;
    const isCloudy = cloudy.includes(conditionCode);
    
    if (isDay && isClear) {
       main.setAttribute('class', 'day');
       conditionBg.setAttribute('class', 'clear');

    } else if (!isDay && isClear) {
        main.setAttribute('class', 'night');
        conditionBg.setAttribute('class', 'clear');

    } else if (isDay && isCloudy) {
        main.setAttribute('class', 'day');
        conditionBg.setAttribute('class', 'cloudy');

    } else if (isDay && !isCloudy && !isClear) {
        main.setAttribute('class', 'day-dark');
        conditionBg.setAttribute('class', 'rainy');

    } else if (!isDay && isCloudy) {
        main.setAttribute('class', 'night');
        conditionBg.setAttribute('class', 'cloudy');

    } else if (!isDay && !isCloudy && !isClear) {
        main.setAttribute('class', 'night');
        conditionBg.setAttribute('class', 'cloudy');

    } else {
        // fallback
        main.setAttribute('class', 'day');
        conditionBg.setAttribute('class', 'clear');
    }

}  

export {changeBackground}