import css from "./style.css";
import loadingScreenStyle from "./styles/loadingScreen.css";
import screenSizesStyle from "./styles/screenSizes.css";
import pageChanger from "./styles/pageChanger.css"

import { assignSearchBtnEvent, onLoadLocationWeather } from "./apps/getLocation";
import { setInitial } from "./apps/userSettings";
import { assignSettingsBtnEvent } from "./apps/settings";
import { assignHourlyResize } from "./apps/displayHourlyForecast";
import { assignAstroBtnEvent, assignAstroResize } from "./apps/displayAstro";

// Add initial on load event listeners
assignSearchBtnEvent(); // adds event listener to search button
assignSettingsBtnEvent(); // adds event listener to settings button

// Sets initial user settings
// Note: this function has a conditional. If user preference already exists in the local storage,
//  it does not create another values
setInitial();

// Loads initial data on DOM using:
// Passed: data from API
// Failed: data saved on the local storage if any
await onLoadLocationWeather();

// Assign resize events after initial data is displayed
assignHourlyResize();
assignAstroResize();
assignAstroBtnEvent();

