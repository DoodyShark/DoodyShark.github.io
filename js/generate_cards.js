function generateElementArray(arr, templates) {

    const [position, final_arr] = JSON.parse(JSON.stringify(templates[arr[0]]));
    content = arr[1];
    value = arr[1];
    children = arr[2];
    if (value && position) {
        pointer = final_arr;
        const len = position.length;
        position.forEach((pos, ind) => {
            if (ind === len - 1) {
                pointer[pos] = value;
            } else {
                pointer = pointer[pos];
            }
        })
    } 
    if (children) {
        final_arr[2] = children.map(child => {
            return generateElementArray(child, templates);
        } );
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
                )
            ]
        ]
    )
}

async function generateCards(fileName, templateFile, id, filter_func) {
    
    const data = await loadFile(fileName);
    const templates = await loadFile(templateFile);
    
    const sections = data.sections;

    const contentArea = document.querySelector(id);

    Object.entries(sections).filter(filter_func).forEach(([sectionTitle, section]) => {
        console.log(sectionTitle);
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
                {class: "uk-child-width-expand@s uk-text-center", "uk-grid": "", "uk-height-match": (config.match && "target: > div > #card")}, 
                sectionContent.slice(i, Math.min(i + config.num_columns, sectionContent.length))
            ]);
            console.log(row);
            sectionRows.push(row);
        }

        sectionRows.forEach((row) => contentArea.appendChild(row));

    })
}

