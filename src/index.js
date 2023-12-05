import css from "./style.css";
import loadingScreenStyle from "./styles/loadingScreen.css";
import screenSizesStyle from "./styles/screenSizes.css";
import { assignSearchBtnEvent, onLoadLocationWeather } from "./apps/getLocation";
import { setInitial } from "./apps/userSettings";
import { assignSettingsBtnEvent } from "./apps/settings";
import { convertTimeFormat } from "./apps/timeScript";

// Add initial on load event listeners
assignSearchBtnEvent(); // adds event listener to search button
assignSettingsBtnEvent(); // adds event listener to settings button

// Sets initial user settings
// Note: this function has a conditional. If user preference already exists in the local storage,
//  it does not create another values
setInitial();

// Loads initial data on DOM using preferences saved on the local storage
onLoadLocationWeather();

console.log(convertTimeFormat('01:09 PM', '24hr'));