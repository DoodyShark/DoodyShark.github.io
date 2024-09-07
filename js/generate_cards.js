document.addEventListener('DOMContentLoaded', main);

function generateElementArray(arr, templates) {

    const [position, final_arr] = templates[arr[0]];
    content = arr[1];
    const mode = typeof content === 'string' ? "value": "children";
    if (mode === "value" && position) {
        pointer = final_arr;
        const len = position.length;
        position.forEach((pos, ind) => {
            if (ind === len - 1) {
                pointer[pos] = content;
            } else {
                pointer = pointer[pos];
            }
        })
    } else if (mode === "children") {
        final_arr[2] = content.map(child => generateElementArray(child, templates));
    }

    return final_arr;
}

function createCard(content, templates) {

    const sections = content.map((arr) => createElement(generateElementArray(arr,templates)));

    return createElement(
        [
            'div', 
            {},
            [
                createElement(
                    [
                        'div', 
                        {class: "uk-card-default uk-width-1-1@m", id: "card"},
                        sections
                    ]
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
            ]
        ]
    )
}

async function main() {

    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('type');

    if (currentPage === "index") { 
        return;
    }
    
    const data = await loadFile(`./json/${currentPage}.json`);
    const templates = await loadFile(`./json/templates.json`);
    
    const sections = data.sections;

    const contentArea = document.querySelector("main > section > div > div");

    Object.entries(sections).forEach(([sectionTitle, section]) => {
        const config = section.config;
        const content = section.content;

        const sectionArr = [
            "div", 
            {class: 'uk-grid', "data-uk-grid-margin": ""}, 
            [
                [
                    "div", {class: "uk-width-1-1 uk-row-first"},
                    [
                        [
                            "h1", 
                            {style: "padding-bottom: 0px; font-size: 25px; font-weight: 300;"},
                            [
                                sectionTitle
                            ]
                        ]
                    ]
                ]
            ]
        ]

        contentArea.appendChild(createElement(sectionArr))

        const sectionContent = content.map(card => createCard(card, templates));

        console.log(sectionContent);

        sectionRows = []

        for (let i = 0; i < sectionContent.length; i+=config.num_columns) {
            const row = createElement( [
                'div', 
                {class: "uk-child-width-expand@s uk-text-center", "uk-grid": "", "uk-height-match": "target: > div > #card"}, 
                sectionContent.slice(i, Math.min(i + config.num_columns, sectionContent.length))
            ]);
            console.log(row);
            sectionRows.push(row);
        }

        sectionRows.forEach((row) => contentArea.appendChild(row));

    })
}