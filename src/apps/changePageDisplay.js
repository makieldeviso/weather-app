const hourlyDisplay = document.querySelector('div#hourly-display');
const leftBtn = document.querySelector('button#hourly-turn-left');
const rightBtn = document.querySelector('button#hourly-turn-right');

const changePageHourlyForecast = function () {
    const hourlyPages = document.querySelectorAll('div.hourly-page');
    const pageLength = hourlyPages.length;

    const carouselMarkers = document.querySelectorAll('div.hourly-page-mark');

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

    // Indicate change to carousel marker
    carouselMarkers[`${currentPage - 1}`].classList.remove('current');
    carouselMarkers[`${pageFlag - 1}`].classList.add('current');

    // Direct/ dynamic styling 
    // Note: styling is added here to avoid hard coding number of pages in css
    hourlyPages.forEach(page => {
        page.setAttribute('style', `transform: translateX(${(pageFlag-1) * -100}%)`);
    });

}

const refreshHourlyPage = function () {
    hourlyDisplay.dataset.page = 1;
    leftBtn.dataset.page = 1;
    rightBtn.dataset.page = 1;
    leftBtn.disabled = true;
    rightBtn.disabled = false;

    // translate pages to 0%/ first page
    const hourlyPages = document.querySelectorAll('div.hourly-page');
    hourlyPages.forEach(page => {
        page.setAttribute('style', 'transform: translateX(0%)');
    });

    // change marker to first page
    const carouselMarkers = document.querySelectorAll('div.hourly-page-mark');
    carouselMarkers.forEach(marker => {
        if (marker.getAttribute('id') === 'hourly-page-mark-1'){
            marker.classList.add('current');
        } else {
            marker.classList.remove('current');
        }
    });
}


const assignHourlyCarouselBtnEvent = function () {
    leftBtn.addEventListener('click', changePageHourlyForecast);
    rightBtn.addEventListener('click', changePageHourlyForecast);
}

export {assignHourlyCarouselBtnEvent, refreshHourlyPage}