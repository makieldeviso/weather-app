const leftBtn = document.querySelector('button#hourly-turn-left');
const rightBtn = document.querySelector('button#hourly-turn-right');

const changePageHourlyForecast = function () {
    const hourlyDisplay = document.querySelector('div#hourly-display');
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
}

const assignHourlyCarouselBtnEvent = function () {
    leftBtn.addEventListener('click', changePageHourlyForecast);
    rightBtn.addEventListener('click', changePageHourlyForecast);
}

export {assignHourlyCarouselBtnEvent}