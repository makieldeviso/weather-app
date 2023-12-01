const baseURL = 'https://api.weatherapi.com/v1';
const apiKey = `39350a4b141049a684c174535232410`;

const getDataFromAPI = async function (location) {
    const forecastRequestURL = `${baseURL}/forecast.json?key=${apiKey}&q=${location}&days=3`;

    try {
        const forecastResponse = await fetch(forecastRequestURL, {
            method: "GET",
            mode: "cors",
        });

        const parsedData = await forecastResponse.json();

        return parsedData;

    } catch(err) {
        const forecastObj = {};
        forecastObj.error = {message:'Connection timed out'};
        
        return forecastObj;
    }
}

export {getDataFromAPI};    