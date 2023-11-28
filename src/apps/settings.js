import { getUserSettings, setUserPref } from "./userSettings";

const settingsTab = document.querySelector('div#settings-tab');

const saveSettings = () => {
    // Remove class attribute open to close
    settingsTab.classList.remove('open');

    // Select domElement then save value
    const tempUnitChecked = document.querySelector("input[name='temp-unit']:checked");
    const otherUnitsChecked = document.querySelector("input[name='other-units']:checked");
    const tempUnitSelected = tempUnitChecked.getAttribute('value');
    const otherUnitsSelected = otherUnitsChecked.getAttribute('value');
    
    const currentSettings = getUserSettings();
    const sameTempUnits = currentSettings.tempUnit === tempUnitSelected;
    const sameOtherUnits = currentSettings.otherUnits === otherUnitsSelected;

    const tempUnitMod = {};
    let otherUnitsMod = {};
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

    // consolidate changes then execute setUserPref to change settings
    const allMods = {...tempUnitMod, ...otherUnitsMod};
    setUserPref(allMods)
}

const openSettings = function () {
    // Toggles settings tab open
    settingsTab.classList.toggle('open');

    // Execute when settings tab is opened
    const settingsIsOpen = settingsTab.getAttribute('class').includes('open');
    if (settingsIsOpen) {
        const userSettings = getUserSettings();
        const { tempUnit, otherUnits } = userSettings;
        
        const tempUnitInput = document.querySelector(`input[name="temp-unit"][value=${tempUnit}]`);
        const otherUnitsInput = document.querySelector(`input[name="other-units"][value=${otherUnits}]`);
        
        tempUnitInput.checked = true;
        otherUnitsInput.checked = true;

        // Add eventListener to save button
        const saveBtn = document.querySelector('button#save-settings-btn');
        saveBtn.addEventListener('click', saveSettings);
    }
    
}



const assignSettingsBtnEvent = function () {
    const settingsBtn = document.querySelector('button#settings');
    settingsBtn.addEventListener('click', openSettings);
}



export {assignSettingsBtnEvent}