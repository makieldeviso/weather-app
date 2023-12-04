import createSvg from "./createSvg";

const createPageChanger = function (assignName, pageLength) {
    const pageChangerCont = document.createElement('div');
    pageChangerCont.setAttribute('id', `${assignName}-page-changer`);
    pageChangerCont.setAttribute('class', 'page-changer');

    const defaultPage = 1;

    const createBtn = function (assignId, dataPage, assignValue) {
        const newBtn = document.createElement('button');
        newBtn.setAttribute('id', assignId);
        newBtn.dataset.page = dataPage;
        newBtn.setAttribute('value', assignValue);

        let btnIcon;
        if (assignValue === 'left') {
            btnIcon = createSvg(`${assignId}-icon`, 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z' );
        } else {
            btnIcon = createSvg(`${assignId}-icon`, 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z');
        }

        newBtn.appendChild(btnIcon);
        
        return newBtn;
    }

    const leftBtn = createBtn(`${assignName}-turn-left`, defaultPage, 'left');
    const rightBtn = createBtn(`${assignName}-turn-right`, defaultPage, 'right');
    const pageMarkerCont = document.createElement('div');
    pageMarkerCont.setAttribute('class', 'page-markers-cont');

    for (let i = 0; i < pageLength; i++) {
        const newPageMarker = document.createElement('div');
        newPageMarker.setAttribute('class', `${assignName} page-mark`);
        newPageMarker.setAttribute('id', `${assignName}-page-mark-${i + 1}`);
        pageMarkerCont.appendChild(newPageMarker);

        // Set first marker as default current
        if ((i + 1) === 1) {
            newPageMarker.classList.add('current');
        }
    }

    const components = [leftBtn, pageMarkerCont, rightBtn];
    components.forEach(comp => pageChangerCont.appendChild(comp));

    return pageChangerCont;
}


const changePageHourlyForecast = function () {
    const hourlyDisplay = document.querySelector('div#hourly-display');
    const leftBtn = document.querySelector('button#hourly-turn-left');
    const rightBtn = document.querySelector('button#hourly-turn-right');

    const hourlyPages = document.querySelectorAll('div.hourly-page');
    const pageLength = hourlyPages.length;

    const pageMarkers = document.querySelectorAll('div.hourly.page-mark');

    const currentPage = Number(this.dataset.page);
    const buttonClicked = this.value;
    
    let pageFlag = currentPage;
    if (buttonClicked === 'right') {
        const newPage = `${currentPage + 1}`; 

        // Translate to new page
        leftBtn.dataset.page = newPage;
        rightBtn.dataset.page = newPage;
        hourlyDisplay.dataset.page = newPage;

        // Update current page using page flag variable
        pageFlag = Number(newPage);

    } else {
        const newPage = `${currentPage - 1}`;

        // Translate to new page
        leftBtn.dataset.page = newPage;
        rightBtn.dataset.page = newPage;
        hourlyDisplay.dataset.page = newPage;

        // Update current page using page flag variable
        pageFlag = Number(newPage);
    }

    // Disable left button if current page is first page
    if (pageFlag === 1) {
        leftBtn.disabled = true;
    } else {
        leftBtn.disabled = false;
    }

    // Disable right button if current page is last page
    if (pageFlag === pageLength) {
        rightBtn.disabled = true;
    } else {
        rightBtn.disabled = false;
    }

    // Indicate change to page marker
    pageMarkers[`${currentPage - 1}`].classList.remove('current');
    pageMarkers[`${pageFlag - 1}`].classList.add('current');

    // Direct/ dynamic styling 
    // Note: styling is added here to avoid hard coding number of pages in css
    hourlyPages.forEach(page => {
        page.setAttribute('style', `transform: translateX(${(pageFlag-1) * -100}%)`);
    });

}

const assignHourlyPageBtnEvent = function () {
    const leftBtn = document.querySelector('button#hourly-turn-left');
    const rightBtn = document.querySelector('button#hourly-turn-right');

    leftBtn.addEventListener('click', changePageHourlyForecast);
    rightBtn.addEventListener('click', changePageHourlyForecast);
}

export {createPageChanger, assignHourlyPageBtnEvent}