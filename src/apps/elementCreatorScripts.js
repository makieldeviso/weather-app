// Reusable Shorter DOM selector
const domElem = function (selector) {
    return document.querySelector(selector);
}

// Reusable span creator
const createSpan = function (parent, assignClass, textContent) {
    const span = document.createElement('span');
    span.setAttribute('class', assignClass);
    span.textContent = textContent;

    parent.appendChild(span);
}

// Reusable weather condition icon maker 
const createCdnIcon = function ( assignClass, time, condition, iconUrl ) {
    const weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('class', assignClass);
    weatherIcon.setAttribute('alt', `${time} ${condition}`);
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('title', condition);

    return weatherIcon;
}

const createSvg = function (assignId, pathD) {

    const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    newSvg.setAttribute('viewBox', '0 0 24 24');
    if (assignId) {
        newSvg.setAttribute('id', assignId);
    }

    const svgPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    svgPath.setAttributeNS(null, 'd', pathD);

    newSvg.appendChild(svgPath);

    return newSvg
}

const toFormal = function (text) {
    const string = text;
    const firstLetter = text.slice(0, 1).toUpperCase();
    const rest = text.slice(1);

    return `${firstLetter}${rest}`;
}

export { domElem, createSpan, createCdnIcon, createSvg, toFormal };