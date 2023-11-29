const createSvg = function (assignId, pathD) {

    const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    newSvg.setAttribute('viewBox', '0 0 24 24');
    newSvg.setAttribute('id', assignId);

    const svgPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    svgPath.setAttributeNS(null, 'd', pathD);

    newSvg.appendChild(svgPath);

    return newSvg
}

export default createSvg;