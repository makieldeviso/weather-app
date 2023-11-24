import { utcToZonedTime } from 'date-fns-tz';
import { format } from "date-fns";
import enGB from 'date-fns/locale/en-GB';


const formatTime = function (dateObj, timeZoneId, timeOptions) {

    let timeString;
    if (timeOptions === 'current_date') {
        timeString = format(dateObj, 'MMMM d, yyyy');

    } else if (timeOptions === 'current_time') {
        timeString = format(dateObj, 'HH:mm');

    } else if (timeOptions === 'day_date') {
        timeString = format(dateObj, 'eee, MMMM d, yyyy ');

    } else if (timeOptions === 'current_hour') {
        timeString = format(dateObj, 'H');
        
    }else {
        timeString = format(dateObj, 'yyyy-MM-dd HH:mm:ss zzzz', {
            timeZone: `${timeZoneId}`, 
            locale: enGB
        });
    }

    return timeString;
}

const getLocalTimeOfSearched = function (data, timeOptions) {
    // Note: data parameter receives full forecast data from API request

    const forecastData = data;
    let localTimeFromClient;
    let timeZoneOfSearched;

    if (Object.hasOwn(data, 'hourly_forecast')) {
        // Note: conditional detect if data passed is an hourly forecast

        localTimeFromClient = new Date(forecastData.time_epoch * 1000);
        timeZoneOfSearched = forecastData.tz_id; 
        
    } else {
        localTimeFromClient = new Date(forecastData.location.localtime_epoch * 1000);
        timeZoneOfSearched = forecastData.location.tz_id;
    }
    
    // Convert local time of client to searched locale time
    const localTimeTZ = utcToZonedTime(localTimeFromClient, timeZoneOfSearched);

    const requiredTime = formatTime(localTimeTZ, timeZoneOfSearched, timeOptions);

    return requiredTime;
}

export { getLocalTimeOfSearched }