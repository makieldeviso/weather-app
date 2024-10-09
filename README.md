# Weather App

## About
Weather App using free tier WeatherAPI. Enter location and check its real-time weather and forecast information in a responsive app display. 

## Objectives
Create a weather web app that fetch data from a weather provider api and display information on a dynamic user interface.

Implement asynchronous code, mainly promises and async/await syntax to run background functions, while other code executes.

Practice accessing API server, fetching and extracting data to implement the functionality and display of the weather app project.

Get comfortable with reading API documentation to understand how the api work, how it serves data, securing api key and even pricing.

## Features
The weather app initially loads weather information of a default city location.

The user can enter desired location to check weather forecast for said locale. Pressing enter or clicking the search button, initialize the search.

The main display shows the city and country where the weather data is being referred, the current temperature and weather condition description. The minimum and maximum temperature for the day is also displayed, as well as other data such as precipitation, humidity, and wind speed and direction.

An hourly forecast for the day is also displayed on the app. Said forecast starts on the next common hour (e.g. 4:30PM next common hour is 5:00PM). Information on this forecast only contains the time and temperature and an icon representative of the condition.

Another information available are the forecast for the next two days, displaying the expected minimum and maximum temperature for those days and expected weather condition.

Astronomy data displays the sunrise, sunset, moonrise, moonset and moon phase for the day and the next two days.

The user can set preferred units to use for display. Temperature units include Celsius and Fahrenheit. Other units can be set as metric or english. Time display is also available in 12-hour or 24-hour format. Pressing save finalize changes made in the settings.

The weather app stores data on the user's local storage. It saves last location searched, last data fetched from the API and the user preferences on the settings. This allow the app to remember information for the next page reload.

This project is responsive and can be viewed on small screens. The astronomy data is minimize on smaller screen and can be viewed by pressing a new astronomy button at the app's header.

## Live Preview
This weather app can be viewed at [Weather App](https://makieldeviso.github.io/weather-app/)


