import { createSvg } from "./elementCreatorScripts";

const defaultChangerStatus = (name) => {
    const pageChangerCont = document.querySelector(`div#${name}-page-changer`);
    const pageDisplay = document.querySelector(`div#${name}-display`);
    const displayPages = document.querySelectorAll(`div.${name}-page`);

    const leftBtn = pageChangerCont.querySelector('button[value="left"]');
    const rightBtn = pageChangerCont.querySelector('button[value="right"]');
    const pageMarkers = pageChangerCont.querySelectorAll('div.page-mark');

    leftBtn.dataset.page = '1';
    leftBtn.disabled = true;
    rightBtn.dataset.page = '1';
    rightBtn.disabled = false;

    pageMarkers.forEach(marker => {
        if (marker.getAttribute('id').includes('page-mark-1')) {
            marker.classList.add('current');
        } else {
            marker.classList.remove('current');
        }
    });

    pageDisplay.scrollLeft = 0;
    displayPages.forEach(page => page.setAttribute('style', 'transform:translateX(0%)'));
}

const createPageChanger = (assignName, pageLength) => {
    const pageChangerCont = document.createElement('div');
    pageChangerCont.setAttribute('id', `${assignName}-page-changer`);
    pageChangerCont.setAttribute('class', 'page-changer');

    const defaultPage = 1;

    const createBtn = (assignId, dataPage, assignValue) => {
        const newBtn = document.createElement('button');
        newBtn.setAttribute('id', assignId);
        newBtn.dataset.page = dataPage;
        newBtn.dataset.name = assignName; // Note: assignName in upper scope
        newBtn.setAttribute('value', assignValue);

        let btnIcon;
        if (assignValue === 'left') {
            newBtn.disabled = true; // disable left button as default
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


const changePage = function () {
    const btnName = this.dataset.name;
    
    const display = document.querySelector(`div#${btnName}-display`);
    const leftBtn = document.querySelector(`button#${btnName}-turn-left`);
    const rightBtn = document.querySelector(`button#${btnName}-turn-right`);

    const displayPages = document.querySelectorAll(`div.${btnName}-page`);
    const pageLength = displayPages.length;

    const pageMarkers = document.querySelectorAll(`div.${btnName}.page-mark`);

    const currentPage = Number(this.dataset.page);
    const buttonClicked = this.value;
    
    let pageFlag = currentPage;
    if (buttonClicked === 'right') {
        const newPage = `${currentPage + 1}`; 

        // Translate to new page
        leftBtn.dataset.page = newPage;
        rightBtn.dataset.page = newPage;
        display.dataset.page = newPage;

        // Update current page using page flag variable
        pageFlag = Number(newPage);

    } else {
        const newPage = `${currentPage - 1}`;

        // Translate to new page
        leftBtn.dataset.page = newPage;
        rightBtn.dataset.page = newPage;
        display.dataset.page = newPage;

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
    displayPages.forEach(page => {
        page.setAttribute('style', `transform: translateX(${(pageFlag-1) * -100}%)`);
    });
}

const assignPageBtnEvent = (name) => {
    const leftBtn = document.querySelector(`button#${name}-turn-left`);
    const rightBtn = document.querySelector(`button#${name}-turn-right`);

    leftBtn.addEventListener('click', changePage);
    rightBtn.addEventListener('click', changePage);
}

export { createPageChanger, assignPageBtnEvent, defaultChangerStatus }