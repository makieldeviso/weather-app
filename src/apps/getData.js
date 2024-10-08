const baseURL = 'https://api.weatherapi.com/v1';
const xkrcd = [];
'8>8:5f9g69659>f;=9h6<9:8:787965'.split('').forEach(char => xkrcd.push(String.fromCharCode(char.charCodeAt(0) - 5)));

const getDataFromAPI = async function (location) {
    const forecastRequestURL = `${baseURL}/forecast.json?key=${xkrcd.join('')}&q=${location}&days=3`;

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