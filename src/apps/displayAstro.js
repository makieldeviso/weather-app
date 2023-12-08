import { format } from "date-fns";
import { createPageChanger, assignPageBtnEvent } from "./changePageDisplay";
import { createSpan, createSvg, domElem, toFormal } from "./elementCreatorScripts"
import { convertTimeFormat } from "./timeScript";
import { getUserPref } from "./userSettings";

const convertNameToId = function (name) {
    const nameArr = name.split(' ');
    const id = nameArr.map(string => string.toLowerCase()).join('-');

    return id;
}

const moonPhaseObj = {
    getMoonSvg: (id) => {
        const moonSvg = moonPhaseObj[id];
        const svgCopy = moonSvg.cloneNode(true);
        return svgCopy;
    }
};

const assignPropToMoonPhase = function (name, path) {
    const moonId = convertNameToId(name);
    const moonIcon = createSvg('', path);

    moonPhaseObj[`${moonId}`] = moonIcon;
}

const newMoon = assignPropToMoonPhase('New Moon', 'M12 20A8 8 0 1 1 20 12A8 8 0 0 1 12 20M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Z');
const waxingCrescent = assignPropToMoonPhase('Waxing Crescent', 'M12 2A9.91 9.91 0 0 0 9 2.46A10 10 0 0 1 9 21.54A10 10 0 1 0 12 2Z');
const firstQuarter = assignPropToMoonPhase('First Quarter', 'M12 2V22A10 10 0 0 0 12 2Z');
const waxingGibbous = assignPropToMoonPhase('Waxing Gibbous', 'M6 12C6 7.5 7.93 3.26 12 2A10 10 0 0 1 12 22C7.93 20.74 6 16.5 6 12Z');
const fullMoon = assignPropToMoonPhase('Full Moon', 'M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2Z');
const waningGibbous = assignPropToMoonPhase('Waning Gibbous', 'M18 12C18 7.5 16.08 3.26 12 2A10 10 0 0 0 12 22C16.08 20.74 18 16.5 18 12Z');
const lastQuarter = assignPropToMoonPhase('Last Quarter', 'M12 2A10 10 0 0 0 12 22Z');
const waningCrescent = assignPropToMoonPhase('Waning Crescent', 'M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z');

// Event listener functions
const assignAstroBtnEvent = function () {
    const showAstroBtn = domElem('button#show-astro');
    const closeModalBtn = domElem('button#close-display-modal');
    const displayModal = domElem('dialog#display-modal');

    const closeModal = () => {
            displayModal.close();
            closeModalBtn.removeEventListener('click', closeModal);
    }

    const showAstro = function () {
        // Show modal
        displayModal.showModal();

        // Add event listener to close button
        closeModalBtn.addEventListener('click', closeModal);
    }

    showAstroBtn.addEventListener('click', showAstro);
}

const assignAstroResize = function () {
    const astroCont = domElem('div#astro-cont');
    const modalCont = domElem('div#modal-cont');
    const forecastDisplay = domElem('div#forecast-display');
    const showAstroBtn = domElem('button#show-astro');
        
    const showAstroOnResize = function () {
        const pageWidth = window.innerWidth;
        const astroInModal = modalCont.contains(astroCont);

        // Ensures that the modal is closed on screen resize
        const modalDialog = domElem('dialog#display-modal');
        if (modalDialog.open === true) {
            modalDialog.close();
        }
        
        if (window.innerWidth < 820  && !astroInModal) {
        // if pageWidth is less than 1024 and astroCont is not inside displayModal
            modalCont.appendChild(astroCont);
            showAstroBtn.classList.remove('hidden');
            showAstroBtn.disabled = false;

        } else if (window.innerWidth >= 820 && astroInModal) {
        // if pageWidth is greater than or equal to 1024 and astroCont is inside displayModal
            forecastDisplay.appendChild(astroCont);
            showAstroBtn.classList.add('hidden');
            showAstroBtn.disabled = true;
        }
    }

    window.addEventListener('resize', showAstroOnResize);
}

const displayAstro = (data) => {
    const astroCont = domElem('div#astro-cont');
    const astroDisplayCont = domElem('div#astro-display');

    const forecastDayData = data.forecast.forecastday;

    for (let i = 0; i < forecastDayData.length; i++) {
        const astroPageCont = document.createElement('div');
        astroPageCont.setAttribute('class', 'astro-page');
        astroPageCont.setAttribute('id', `astro-page-${i + 1}`);

        const specsCont = document.createElement('div');
        specsCont.setAttribute('class', 'astro-specs');
        
        let indicatorText;
        if (i === 0) {
            indicatorText = 'Today';
        } else if (i === 1) {
            indicatorText = 'Tomorrow';
        } else if (i === 2) {
            const date = new Date(forecastDayData[2].date);
            const dateDay = format(date, 'EEEE');
            indicatorText = dateDay;
        }

        const indicator = document.createElement('p');
        indicator.setAttribute('class', 'day-indicator');
        indicator.textContent = indicatorText;

        const createAstroSpec = function (spec) {
            const newSpec = document.createElement('p');
            newSpec.setAttribute('class', spec);

            const timeFormat = getUserPref('timeFormat');
            const timeVal = forecastDayData[i].astro[spec];
            const formattedTime = convertTimeFormat(timeVal, timeFormat);

            createSpan(newSpec, 'astro-label', `${toFormal(spec)}:`);
            createSpan(newSpec, 'astro-value', formattedTime);

            return newSpec;
        }

        const sunrise = createAstroSpec('sunrise');
        const sunset = createAstroSpec('sunset');
        const moonrise = createAstroSpec('moonrise');
        const moonset = createAstroSpec('moonset');

        // Assemble astro specs
        const specsComp = [sunrise, sunset, moonrise, moonset];
        specsComp.forEach(comp => specsCont.appendChild(comp));

        const moonPhaseCont = document.createElement('div')
        moonPhaseCont.setAttribute('class', 'moonphase-cont');
        moonPhaseCont.setAttribute('id', `moonphase-cont-${i + 1}`);

        const moonPhase = forecastDayData[i].astro.moon_phase;

        const icon = moonPhaseObj.getMoonSvg(`${convertNameToId(moonPhase)}`);
        icon.setAttribute('class', 'moon-icon');
        icon.setAttribute('id', `moon-icon-${i + 1}`);

        const moonName = document.createElement('p');
        moonName.setAttribute('class', 'moonphase-name');
        moonName.textContent = moonPhase;

        // Assemble moon phase details
        const moonComp = [icon, moonName];
        moonComp.forEach(comp => moonPhaseCont.appendChild(comp));
        
        // Assemble All to parent container
        const astroDetailComp = [indicator, specsCont, moonPhaseCont];
        astroDetailComp.forEach(comp => astroPageCont.appendChild(comp));
        
        // Append all Display to DOM
        // Note: astroDisplayCont must already exist in the DOM
        astroDisplayCont.appendChild(astroPageCont);
    }

    const pageChanger = createPageChanger('astro', forecastDayData.length);
    astroCont.appendChild(pageChanger);

    // Add required event listener
    assignPageBtnEvent('astro');

    if (window.innerWidth < 820) {
        const modalCont = domElem('div#modal-cont');    
        modalCont.appendChild(astroCont);
    } else {
        const showAstroBtn = domElem('button#show-astro');
        showAstroBtn.classList.add('hidden');
        showAstroBtn.disabled = true;
    }
}

export { displayAstro, assignAstroResize, assignAstroBtnEvent } 