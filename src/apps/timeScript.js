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

const convertTimeFormat = function (time, format) {

    const format12hour = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
    const format24hour =  /^(?:[01]\d|2[0-3]):[0-5]\d$/;

    const is12hr = format12hour.test(time);
    const is24hr = format24hour.test(time);
    
    const convertTo24 = function (time12) {
        const indicator = time12.slice(-2);
        const hour = Number(time12.slice(0, 2));
        const minutes = time12.slice(3, 5);
        
        let hourVal;
        if (hour === 12 && indicator === 'AM') {
            hourVal = '00';

        } else if (hour !== 12 && indicator === 'AM') {
            hourVal = hour;

        } else if (hour === 12 && indicator === 'PM') {
            hourVal = hour;

        } else if (hour !== 12 && indicator === 'PM') {
            hourVal = hour + 12;
        }

        // Ensure hour format HH
        let newHour = `${hourVal}`
        if ( newHour.length === 1) {
            newHour = `0${newHour}`;
        }

        const formattedTime = `${newHour}:${minutes}`;
        return formattedTime;
    }
    
    const convertTo12 = function (time24) {
        const hour = Number(time24.slice(0, 2));
        const minutes = time24.slice(3, 5);
        let indicator;
        let hourVal;
        if (hour >= 12) {
            indicator = 'PM';
            if (hour === 12) {
                hourVal = hour;
            } else {
                hourVal = hour - 12;
            }
            
        } else {
            indicator = 'AM';
            if (hour === 0) {
                hourVal = 12;
            } else {
                hourVal = hour;
            }
            
        }

        // Ensure hour format hh
        let newHour = `${hourVal}`
        if ( newHour.length === 1) {
            newHour = `0${newHour}`;
        }

        const formattedTime = `${newHour}:${minutes} ${indicator}`;
        return formattedTime;
    }

    const convertTo12simp = function (time12) {
        const indicator = time12.slice(-2);
        const hour = Number(time12.slice(0, 2));

        const simplified = `${hour} ${indicator}`;
        return simplified;
    }

    let timeRequired = time;
    // Note: if current time format is already the required format, conditionals will not run
    if (is12hr && format === 'hr-24') {
        timeRequired = convertTo24(time);
    
    } else if (is24hr && format === 'hr-12') {
        timeRequired = convertTo12(time);

    } else if (is12hr && format === 'hr-12-simplify') {
        timeRequired = convertTo12simp(time);
    }

    return timeRequired;
}

export { getLocalTimeOfSearched, convertTimeFormat}