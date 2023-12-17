let forecastData;

const setForecastData = (data) => {
    forecastData = data;   
}

const getForecastData = () => forecastData;

export {setForecastData, getForecastData};