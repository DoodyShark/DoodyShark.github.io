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
    children.forEach(c => {
        c && ele.appendChild( typeof c === 'string' ? document.createTextNode(c) : c)
    } );
  
    return ele;
}

function create_card(entry, config, template) {

    const sections = Object.keys(entry).filter((section) => template.hasOwnProperty(section)).map((section) => {
        console.log(section);
        const section_components = entry[section].map(([key, value]) => {
            const current_templ = {...template[section]["children"][key]};
            // Search for "VALUE"
            let index = -1;
            
            index = Object.entries(current_templ.attrs).findIndex(([_, value]) => value === "VALUE");
            if (index !== -1) {
                current_templ.attrs[Object.keys(current_templ.attrs)[index]] = value;
            }

            current_templ.children.forEach((child, ind) => {
                if (child === "VALUE") {
                    current_templ.children[ind] = value;
                    console.log("Yup")
                } else if (child.children[0] == "VALUE") {
                    current_templ.children[ind].children[0] = value;
                } else {
                    let attr_index = Object.entries(child.attrs).findIndex(([_, value]) => value === "VALUE")
                    if (attr_index !== -1) {
                        current_templ.children[ind].attrs[Object.keys(child.attrs)[attr_index]] = value;
                    }
                }
            })

            return createElement(current_templ.type, current_templ.attrs, 
                ...current_templ.children.map((child)=>{
                    return typeof child === 'string' ? child : createElement(child.type, child.attrs, ...child.children)
                })
            );
        });
        
        return createElement(template[section].type, template[section].attrs, 
            ...section_components
        );
    });

    console.log(sections);

    return createElement('div', {},
        createElement('div', {class: "uk-card-default uk-width-1-1@m", id: "card"},
            ...sections
            // createElement('div', {class: "uk-card-body"},
            //     createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
            //         createElement('div', {class: "uk-width-expand"}, 
            //             createElement('h3', {class: "uk-card-title uk-margin-remove-bottom"}, entry.header.title),
            //         )
            //     )
            // ), 
            // createElement('div', {class: "uk-card-footer"},
            //     createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
            //         createElement('div', {class: "uk-width-expand"}, 
            //             createElement('p', {class: "uk-text-meta uk-margin-remove-top"}, 
            //                 createElement('time', {style: "color: #40c060"}, entry.body.content)
            //             ),
            //         )
            //     )
            // )
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
    const templates = await loadFile(`./json/card_templates.json`);
    
    const config = data.config;
    const template = templates[data.config.template];
    const cards = data.cards;

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
        
            return create_card(entry, config, template);
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
