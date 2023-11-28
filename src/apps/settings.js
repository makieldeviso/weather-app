import { getUserSettings } from "./userSettings";

const openSettings = function () {

    const settingsTab = document.querySelector('div#settings-tab');
    
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
    }
    
}



const assignSettingsBtnEvent = function () {
    const settingsBtn = document.querySelector('button#settings');
    settingsBtn.addEventListener('click', openSettings);
}



export {assignSettingsBtnEvent}