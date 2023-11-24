import { utcToZonedTime } from 'date-fns-tz';
import { format } from "date-fns";
import enGB from 'date-fns/locale/en-GB';


const formatTime = function (dateObj, timeZoneId, timeOptions) {

    let formattedDate;
    if (timeOptions === 'date') {
        formattedDate = format(dateObj, 'MMMM d, yyyy');

    } else if (timeOptions === 'hour_minute') {
        formattedDate = format(dateObj, 'HH:mm');

    } else if (timeOptions === 'day_date') {
        formattedDate = format(dateObj, 'eee, MMMM d, yyyy ');

    } else if (timeOptions === 'month_day') {
        formattedDate = format(dateObj, 'MM/dd');

    } else if (timeOptions === 'current_hour') {
        formattedDate = Number(format(dateObj, 'H'));
        
    } else if (timeOptions === 'weekday') {
        formattedDate = format(dateObj, 'EEEE');

    } else {
        formattedDate = format(dateObj, 'yyyy-MM-dd HH:mm:ss zzzz', {
            timeZone: `${timeZoneId}`, 
            locale: enGB
        });
    }

    return formattedDate;
}

const getLocalTimeOfSearched = function (data, timeZoneId, timeOptions) {
    // Note: data parameter receives full forecast data from API request

    const forecastData = data;
    let localTimeFromClient;

    if (Object.hasOwn(data, 'time_epoch')) {
        // Note: conditional detect if data passed is an hourly forecast

        localTimeFromClient = new Date(forecastData.time_epoch * 1000);

    } else if (Object.hasOwn(data, 'date_epoch')) {
        localTimeFromClient = new Date((forecastData.date_epoch * 1000));
        console.log(localTimeFromClient);

    } else {
        localTimeFromClient = new Date(forecastData.location.localtime_epoch * 1000);
    }
    
    // Convert local time of client to searched locale time
    const localTimeTZ = utcToZonedTime(localTimeFromClient, timeZoneId);

    // Execute formatTime to get formatted date/time value required
    const requiredTime = formatTime(localTimeTZ, timeZoneId, timeOptions);

    return requiredTime;
}

export { getLocalTimeOfSearched }