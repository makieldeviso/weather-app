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
    console.log(closeBtnIcon);
    closeBtn.appendChild(closeBtnIcon);

    // Assemble components
    const components = [alertIcon, errorMsg, moreErrorMsg, closeBtn];
    components.forEach(comp => errorMsgCont.appendChild(comp));

    return errorMsgCont;
}

const showAlertMessage = function () {
    const main = document.querySelector('main');

    const errorTab = createAlertMessage('No response from server', 'Try again later.');

    main.appendChild(errorTab);
}

export {showAlertMessage}