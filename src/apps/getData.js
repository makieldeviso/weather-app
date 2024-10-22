const baseURL = 'https://api.weatherapi.com/v1';
const xkrcd = [];
'i5if5:8>j<;j9fkig7<6;7;:6797765'.split('').forEach(char => xkrcd.push(String.fromCharCode(char.charCodeAt(0) - 5)));

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