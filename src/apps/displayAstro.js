import { createSpan, createSvg, domElem, toFormal } from "./elementCreatorScripts"

const convertNameToId = function (name) {
    const nameArr = name.split(' ');
    const id = nameArr.map(string => string.toLowerCase()).join('-');

    return id;
}

const moonPhaseObj = {};
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

const displayAstro = (data) => {
    const astroDisplayCont = domElem('div#astro-display');

    const forecastDayData = data.forecast.forecastday;

    for (let i = 0; i < forecastDayData.length; i++) {
        const astroDetailCont = document.createElement('div');
        astroDetailCont.setAttribute('class', 'astro-detail');
        astroDetailCont.setAttribute('id', `astro-page${i + 1}`);

        const specsCont = document.createElement('div');
        specsCont.setAttribute('class', 'astro-specs');
        
        let indicatorText;
        if (i === 0) {
            indicatorText = 'Today';
        } else if (i === 1) {
            indicatorText = 'Tomorrow';
        } else if (i === 2) {
            indicatorText = 'Soon';
        }

        const indicator = document.createElement('p');
        indicator.setAttribute('class', 'day-indicator');
        indicator.textContent = indicatorText;

        const createAstroSpec = function (spec) {
            const newSpec = document.createElement('p');
            newSpec.setAttribute('class', spec);
            createSpan(newSpec, 'astro-label', `${toFormal(spec)}:`);
            createSpan(newSpec, 'astro-value', forecastDayData[i].astro[spec]);

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

        const moonPhase = forecastDayData[i].astro.moon_phase;

        const icon = moonPhaseObj[`${convertNameToId(moonPhase)}`];
        icon.setAttribute('class', 'moon-icon');

        const moonName = document.createElement('p');
        moonName.setAttribute('class', 'moonphase-name');
        moonName.textContent = moonPhase;

        // Assemble moon phase details
        const moonComp = [icon, moonName];
        moonComp.forEach(comp => moonPhaseCont.appendChild(comp));

        // Assemble All to parent container
        const astroDetailComp = [indicator, specsCont, moonPhaseCont];
        astroDetailComp.forEach(comp => astroDetailCont.appendChild(comp));
        
        // Append all Display to DOM
        // Note: astroDisplayCont must already exist in the DOM
        astroDisplayCont.appendChild(astroDetailCont);
    }
}

export { displayAstro }