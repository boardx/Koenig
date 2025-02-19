import {addCreateDocumentOption} from '../../../../utils/add-create-document-option';

function cardTemplate(nodeData) {
    const cardClasses = getCardClasses(nodeData).join(' ');

    const backgroundAccent = nodeData.backgroundColor === 'accent' ? 'kg-style-accent' : '';
    const buttonAccent = nodeData.buttonColor === 'accent' ? 'kg-style-accent' : '';
    const buttonStyle = nodeData.buttonColor !== 'accent' ? `background-color: ${nodeData.buttonColor};` : ``;
    const alignment = nodeData.alignment === 'center' ? 'kg-align-center' : '';
    const backgroundImageStyle = nodeData.backgroundColor !== 'accent' && (!nodeData.backgroundImageSrc || nodeData.layout === 'split') ? `background-color: ${nodeData.backgroundColor}` : '';

    const imgTemplate = nodeData.backgroundImageSrc ? `
        <picture><img class="kg-header-card-image" src="${nodeData.backgroundImageSrc}" alt="" /></picture>
    ` : ``;
    return `
        <div class="${cardClasses} ${backgroundAccent}" style="${backgroundImageStyle};">
            ${nodeData.layout !== 'split' ? imgTemplate : ''}
            <div class="kg-header-card-content">
                ${nodeData.layout === 'split' ? imgTemplate : ''}
                <div class="kg-header-card-text ${alignment}">
                    <h2 class="kg-header-card-heading" style="color: ${nodeData.textColor};">${nodeData.header}</h2>
                    <h3 class="kg-header-card-subheading" style="color: ${nodeData.textColor};">${nodeData.subheader}</h3>
                    ${nodeData.buttonEnabled && nodeData.buttonUrl && nodeData.buttonUrl.trim() !== '' ? `<a href="${nodeData.buttonUrl}" class="kg-header-card-button ${buttonAccent}" style="${buttonStyle}color: ${nodeData.buttonTextColor};">${nodeData.buttonText}</a>` : ''}
                </div>
            </div>
        </div>
        `;
}

function emailTemplate(nodeData) {
    const backgroundAccent = nodeData.backgroundColor === 'accent' ? `background-color: ${nodeData.accentColor};` : '';
    const buttonAccent = nodeData.buttonColor === 'accent' ? `background-color: ${nodeData.accentColor};` : nodeData.buttonColor;
    const buttonStyle = nodeData.buttonColor !== 'accent' ? `background-color: ${nodeData.buttonColor};` : '';
    const alignment = nodeData.alignment === 'center' ? 'text-align: center;' : '';
    const backgroundImageStyle = nodeData.backgroundImageSrc ? (nodeData.layout !== 'split' ? `background-image: url(${nodeData.backgroundImageSrc}); background-size: cover; background-position: center center;` : `background-color: ${nodeData.backgroundColor};`) : `background-color: ${nodeData.backgroundColor};`;
    const splitImageStyle = `background: url(${nodeData.backgroundImageSrc}) center center / ${nodeData.backgroundSize !== 'contain' ? 'cover' : '40%'}; mso-hide: all`;

    return `
        <div class="kg-header-card kg-v2" style="color:${nodeData.textColor}; ${alignment} ${backgroundImageStyle} ${backgroundAccent}">
            ${nodeData.layout === 'split' && nodeData.backgroundImageSrc ? `
                <table class="kg-header-card-image" background="${nodeData.backgroundImageSrc}" style="${splitImageStyle} role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr><td></td></tr>
                </table>
            ` : ''}
            <div class="kg-header-card-content" style="${nodeData.layout === 'split' && nodeData.backgroundSize === 'contain' ? 'padding-top: 0;' : ''}">
                <h2 class="kg-header-card-heading" style="color:${nodeData.textColor};">${nodeData.header}</h2>
                <h3 class="kg-header-card-subheading" style="color:${nodeData.textColor};">${nodeData.subheader}</h3>
                ${nodeData.buttonEnabled && nodeData.buttonUrl && nodeData.buttonUrl.trim() !== '' ? `
                    <a class="kg-header-card-button" href="${nodeData.buttonUrl}" style="color: ${nodeData.buttonTextColor}; ${buttonStyle} ${buttonAccent}">${nodeData.buttonText}</a>
                ` : ''}
            </div>
        </div>
    `;
}

export function renderHeaderNodeV2(dataset, options = {}) {
    addCreateDocumentOption(options);
    const document = options.createDocument();

    const node = {
        alignment: dataset.__alignment,
        buttonText: dataset.__buttonText,
        buttonEnabled: dataset.__buttonEnabled,
        buttonUrl: dataset.__buttonUrl,
        header: dataset.__header,
        subheader: dataset.__subheader,
        backgroundImageSrc: dataset.__backgroundImageSrc,
        backgroundSize: dataset.__backgroundSize,
        backgroundColor: dataset.__backgroundColor,
        buttonColor: dataset.__buttonColor,
        layout: dataset.__layout,
        textColor: dataset.__textColor,
        buttonTextColor: dataset.__buttonTextColor,
        swapped: dataset.__swapped,
        accentColor: dataset.__accentColor
    };

    if (options.target === 'email') {
        const emailDoc = options.createDocument();
        const emailDiv = emailDoc.createElement('div');

        emailDiv.innerHTML = emailTemplate(node)?.trim();

        return {element: emailDiv.firstElementChild};
        // return {element: document.createElement('div')}; // TODO
    }

    const htmlString = cardTemplate(node);

    const element = document.createElement('div');
    element.innerHTML = htmlString?.trim();

    if (node.header === '') {
        const h2Element = element.querySelector('.kg-header-card-heading');
        if (h2Element) {
            h2Element.remove();
        }
    }

    if (node.subheader === '') {
        const h3Element = element.querySelector('.kg-header-card-subheading');
        if (h3Element) {
            h3Element.remove();
        }
    }

    return {element: element.firstElementChild};
}

export function getCardClasses(nodeData) {
    let cardClasses = ['kg-card kg-header-card kg-v2'];

    if (nodeData.layout && nodeData.layout !== 'split') {
        cardClasses.push(`kg-width-${nodeData.layout}`);
    }

    if (nodeData.layout === 'split') {
        cardClasses.push('kg-layout-split kg-width-full');
    }

    if (nodeData.swapped && nodeData.layout === 'split') {
        cardClasses.push('kg-swapped');
    }

    if (nodeData.layout && nodeData.layout === 'full') {
        cardClasses.push(`kg-content-wide`);
    }

    if (nodeData.layout === 'split') {
        if (nodeData.backgroundSize === 'contain') {
            cardClasses.push('kg-content-wide');
        }
    }

    return cardClasses;
}
