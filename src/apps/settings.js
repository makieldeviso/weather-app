import { getUserSettings, setUserPref } from "./userSettings";
import { displayDataToDOM } from "./displayDataToDom";

const settingsTab = document.querySelector('div#settings-tab');
const settingsBtn = document.querySelector('button#settings');

const addCloseTabOutsideClick = (action) => {
    const body = document.querySelector('body');
    const saveSettingsBtn = document.querySelector('button#save-settings-btn');

    const closeSettingsTabOutsideClick = (event) => {
        if (!settingsTab.contains(event.target)) {
            settingsTab.classList.remove('open');
            body.removeEventListener('click', closeSettingsTabOutsideClick);

        } else if (saveSettingsBtn.contains(event.target)) {
            body.removeEventListener('click', closeSettingsTabOutsideClick);
        }
    }

    if (action === true) {
        body.addEventListener('click', closeSettingsTabOutsideClick);

    } else if (action === false) {
        body.removeEventListener('click', closeSettingsTabOutsideClick);
    }
}

const saveSettings = () => {
    // Remove class attribute open to close
    settingsTab.classList.remove('open');

    // Select domElement then save value
    const tempUnitChecked = document.querySelector("input[name='temp-unit']:checked");
    const otherUnitsChecked = document.querySelector("input[name='other-units']:checked");
    const timeFormatChecked = document.querySelector("input[name='time-format']:checked");
    const tempUnitSelected = tempUnitChecked.getAttribute('value');
    const otherUnitsSelected = otherUnitsChecked.getAttribute('value');
    const timeFormatSelected = timeFormatChecked.getAttribute('value');
    
    const currentSettings = getUserSettings();
    const sameTempUnits = currentSettings.tempUnit === tempUnitSelected;
    const sameOtherUnits = currentSettings.otherUnits === otherUnitsSelected;
    const sameTimeFormat = currentSettings.timeFormat === timeFormatSelected;

    const tempUnitMod = {};
    let otherUnitsMod = {};
    const timeFormatMod = {};
    if (!sameTempUnits) {
        tempUnitMod.tempUnit = tempUnitSelected;
    }

    if (!sameOtherUnits) {
        const createOtherUnitsMod = (others) => {
            const otherUnits = others;
    
            let precipUnit;
            let windUnit;
            if (otherUnits === 'metric') {
                precipUnit = 'mm';
                windUnit = 'kph';
            } else {
                precipUnit = 'in';
                windUnit = 'mph';
            }
    
            return {otherUnits, precipUnit, windUnit}
        }
        otherUnitsMod = createOtherUnitsMod(otherUnitsSelected);
    }

    if (!sameTimeFormat) {
        timeFormatMod.timeFormat = timeFormatSelected;
    }

    // consolidate changes into one object
    const allMods = {...tempUnitMod, ...otherUnitsMod, ...timeFormatMod};

    // If modification were made execute setUserPref to change settings
    if (Object.keys(allMods).length !== 0) {
        setUserPref(allMods);

        // Display data to DOM using last forecast data saved in local storage
        const { lastDataReceived } = getUserSettings();
        displayDataToDOM(lastDataReceived);
    }   
}

const openSettings = () => {
    // Toggles settings tab open
    settingsTab.classList.toggle('open');
   
    // Execute when settings tab is opened
    const settingsIsOpen = settingsTab.getAttribute('class').includes('open');

    if (settingsIsOpen) {
        const userSettings = getUserSettings();
        const { tempUnit, otherUnits, timeFormat } = userSettings;
        
        const tempUnitInput = document.querySelector(`input[name="temp-unit"][value=${tempUnit}]`);
        const otherUnitsInput = document.querySelector(`input[name="other-units"][value=${otherUnits}]`);
        const timeFormatInput = document.querySelector(`input[name="time-format"][value=${timeFormat}]`);
        
        const userDefaultInput = [tempUnitInput, otherUnitsInput, timeFormatInput];
        userDefaultInput.forEach(input => {
            const defaultInput = input;
            defaultInput.checked = true
        });
        
        // Add eventListener to save button
        const saveBtn = document.querySelector('button#save-settings-btn');
        saveBtn.addEventListener('click', saveSettings);

        // Note: setTimeout ensures that the tab is opened first before adding eventListener 
        // that causes tab to immediately close
        setTimeout( () => addCloseTabOutsideClick(true), 300 );
    }
}

const assignSettingsBtnEvent = () => {
    settingsBtn.addEventListener('click', openSettings);
}


export {assignSettingsBtnEvent}