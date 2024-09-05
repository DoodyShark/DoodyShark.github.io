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

async function main() {
    
    const courses = await loadFile("./json/courses.json");
    
    console.log(courses);


    const contentArea = document.querySelector("main > section > div > div");

    console.log(contentArea)

    const currentCourses = Object.entries(courses['cards']['current']).map(([_, {title, date}]) => {
        
        return createElement('div', {},
            createElement('div', {class: "uk-card-default uk-width-1-1@m", id: "card"},
                createElement('div', {class: "uk-card-body"},
                    createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
                        createElement('div', {class: "uk-width-expand"}, 
                            createElement('h3', {class: "uk-card-title uk-margin-remove-bottom"}, title),
                        )
                    )
                ), 
                createElement('div', {class: "uk-card-footer"},
                    createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
                        createElement('div', {class: "uk-width-expand"}, 
                            createElement('p', {class: "uk-text-meta uk-margin-remove-top"}, 
                                createElement('time', {style: "color: #40c060"}, date)
                            ),
                        )
                    )
                )
            )
        )
    })

    const pastCourses = Object.entries(courses['cards']['past']).map(([_, {title, date}]) => {
        return createElement('div', {},
            createElement('div', {class: "uk-card-default uk-width-1-1@m", id: "card"},
                createElement('div', {class: "uk-card-body"},
                    createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
                        createElement('div', {class: "uk-width-expand"}, 
                            createElement('h3', {class: "uk-card-title uk-margin-remove-bottom"}, title),
                        )
                    )
                ), 
                createElement('div', {class: "uk-card-footer"},
                    createElement('div', {"uk-grid": "", class:"uk-grid-small uk-flex-middle"},
                        createElement('div', {class: "uk-width-expand"}, 
                            createElement('p', {class: "uk-text-meta uk-margin-remove-top"}, 
                                createElement('time', {style: "color: #40c060"}, date)
                            ),
                        )
                    )
                )
            )
        )
    })

    currentRows = []

    for (let i = 0; i < currentCourses.length; i+=3) {
        const row = createElement('div', {class: "uk-child-width-expand@s uk-text-center", "uk-grid": "", "uk-height-match": "target: > div > #card"},
            ...(currentCourses.slice(i, Math.min(i + 3, currentCourses.length)))
        )
        currentRows.push(row);
    }

    pastRows = []

    for (let i = 0; i < pastCourses.length; i+=3) {
        const row = createElement('div', {class: "uk-child-width-expand@s uk-text-center", "uk-grid": "", "uk-height-match": "target: > div > #card"},
            ...(pastCourses.slice(i, Math.min(i + 3, pastCourses.length)))
        )
        pastRows.push(row);
    }

    contentArea.appendChild(
        createElement('div', {class: 'uk-grid', "data-uk-grid-margin": ""},
            createElement('div', {class: "uk-width-1-1 uk-row-first"},
                createElement('h1', {style: "padding-bottom: 0px; font-size: 25px; font-weight: 300;"}, "Current Courses")
            ),
            createElement('a', {href: "https://forms.gle/Y7idJ5yQimUL8Xjr8", class: "uk-button uk-button-text"}, "Request Transcript")
        )
    )

    currentRows.forEach((row) => contentArea.appendChild(row));

    contentArea.appendChild(createElement('div', {class: 'uk-grid', "data-uk-grid-margin": ""},
        createElement('div', {class: "uk-width-1-1 uk-row-first"},
            createElement('h1', {style: "padding-bottom: 0px; font-size: 25px; font-weight: 300;"}, "Past Courses")
        )
    ))

    pastRows.forEach((row) => contentArea.appendChild(row));

    console.log(await loadFile("./json/courses.json"));

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
