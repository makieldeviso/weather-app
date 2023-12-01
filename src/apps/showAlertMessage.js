import createSvg from "./createSvg";

const createAlertMessage = function (errorText, errorDetail ) {
    const errorMsgCont = document.createElement('div');
    errorMsgCont.setAttribute('id', 'error-message-cont');

    const alertIcon = createSvg( 'alert-icon', 'M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16' );

    const errorMsg = document.createElement('p');
    errorMsg.setAttribute('id', 'error-message');
    errorMsg.textContent = errorText;

    const moreErrorMsg = document.createElement('p');
    moreErrorMsg.setAttribute('id', 'more-error-message');
    moreErrorMsg.textContent = errorDetail;

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('id', 'close-error');
    closeBtn.setAttribute('aria-label', 'close alert tab');
    const closeBtnIcon = createSvg( 'close-error', 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' );
    closeBtn.appendChild(closeBtnIcon);

    // Assemble components
    const components = [alertIcon, errorMsg, moreErrorMsg, closeBtn];
    components.forEach(comp => errorMsgCont.appendChild(comp));

    return errorMsgCont;
}

const closeAlertTab = function (event) {
    const main = document.querySelector('main');
    const body = document.querySelector('body');
    const alertTab = document.querySelector('div#error-message-cont');
    const closeBtn = document.querySelector('button#close-error');

    if (closeBtn.contains(event.target)) {
        // Note: remove eventlistener to body first  
        // so that body eventListener will not trigger first before closeBtn eventListener
        body.removeEventListener('click', closeAlertTab); // must come first
        main.removeChild(alertTab); // must come second
    }

    if (!alertTab.contains(event.target)) {

        body.removeEventListener('click', closeAlertTab);
        alertTab.classList.add('fade')   
        alertTab.addEventListener('animationend', () => main.removeChild(alertTab), {once:true});
        
    }    
}

const showAlertMessage = function (errorObj) {
    const errorMsg = errorObj.error.message;
    let notifMsg = 'Please try again later.'
    const main = document.querySelector('main');

    if (errorMsg.includes('No matching location found.')) {
        notifMsg = 'Try searching for a better location.'
    }

    const errorTab = createAlertMessage(errorMsg, notifMsg);
    main.appendChild(errorTab);

    // Add eventlistener to close alert message tab
    const closeAlertBtn =  document.querySelector('button#close-error');
    closeAlertBtn.addEventListener('click', closeAlertTab);

    // Add eventListener to body that closes alert tab if user click anywhere outside of alert tab
    const body = document.querySelector('body');
    body.addEventListener('click', closeAlertTab);
}

export {showAlertMessage}