document.addEventListener('DOMContentLoaded', main);

function createElement(type, attrs, ...children) {
    const ele = document.createElement(type);

    // add element attributes
    for (const prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        ele.setAttribute(prop, attrs[prop]);
      }
    }
  
    // add child nodes to element
    children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  
    return ele;
}

function create_card(entry, config) {
    return createElement('div', {},
        createElement('div', {class: "uk-card-default uk-width-1-1@m", id: "card"},
            createElement('div', {class: "uk-card-body"},
                createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
                    createElement('div', {class: "uk-width-expand"}, 
                        createElement('h3', {class: "uk-card-title uk-margin-remove-bottom"}, entry.header.title),
                    )
                )
            ), 
            createElement('div', {class: "uk-card-footer"},
                createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
                    createElement('div', {class: "uk-width-expand"}, 
                        createElement('p', {class: "uk-text-meta uk-margin-remove-top"}, 
                            createElement('time', {style: "color: #40c060"}, entry.body.content)
                        ),
                    )
                )
            )
        )
    )
}

async function main() {

    let currentPage =  window.location.href;
    currentPage = currentPage.split("/");
    currentPage = currentPage[currentPage.length - 1].split(".html")[0];

    if (currentPage === "index") { 
        console.log("In index page lol");
        return;
    }
    
    const data = await loadFile(`./json/${currentPage}.json`);
    
    config = data.config;
    cards = data.cards;

    console.log(config);
    console.log(cards);

    const contentArea = document.querySelector("main > section > div > div");

    Object.entries(cards).forEach(([sectionTitle, content]) => {
        contentArea.appendChild(createElement('div', {class: 'uk-grid', "data-uk-grid-margin": ""},
                    createElement('div', {class: "uk-width-1-1 uk-row-first"},
                        createElement('h1', {style: "padding-bottom: 0px; font-size: 25px; font-weight: 300;"}, sectionTitle)
                    ),
                    // createElement('a', {href: "https://forms.gle/Y7idJ5yQimUL8Xjr8", class: "uk-button uk-button-text"}, "Request Transcript")
                )
        )

        const sectionContent = Object.entries(content).map(([_, entry]) => {
        
            return create_card(entry, config);
        });

        sectionRows = []


        for (let i = 0; i < sectionContent.length; i+=config.num_columns) {
            const row = createElement(
                'div', {class: "uk-child-width-expand@s uk-text-center", "uk-grid": "", "uk-height-match": "target: > div > #card"},
                ...(sectionContent.slice(i, Math.min(i + config.num_columns, sectionContent.length)))
            );
            sectionRows.push(row);
        }

        sectionRows.forEach((row) => contentArea.appendChild(row));

    })
}

async function loadFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Failed to load file:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error loading file:', error);
        return null;
    }
}
