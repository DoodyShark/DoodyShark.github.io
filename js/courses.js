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

    console.log(await loadFile("./json/projects.json"));

}

async function loadFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const result = await response.text();
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

const courses = {
    cards: {
        current: [
            {
                "title": "Applied Machine Learning",
                "date": "Fall 2024"
            }, 
            {
                "title": "Senior Design Capstone Project",
                "date": "Fall 2024"
            },
            {
                "title": "Future of Medicine",
                "date": "Fall 2024"
            },
            {
                "title": "Theory of Everything",
                "date": "Fall 2024"
            },
            {
                "title": "Foundations of 2D",
                "date": "Fall 2024"
            }
        ],
        past: [
            {
                "title": "Operating Systems",
                "date": "Spring 2024"
            },
            {
                "title": "Software Engineering",
                "date": "Spring 2024"
            },
            {
                "title": "Applied Internet Technology",
                "date": "Spring 2024"
            },
            {
                "title": "Communication Networks",
                "date": "Spring 2024"
            },
            {
                "title": "Theater & Immigration",
                "date": "January 2024"
            },
            {
                "title": "Computer Architecture & Organization",
                "date": "Fall 2023"
            },
            {
                "title": "Haptics & Telerobotics in Medicine",
                "date": "Fall 2023"
            },
            {
                "title": "Data Structures & Algorithms",
                "date": "Fall 2023"
            },
            {
                "title": "Embedded Systems Design",
                "date": "Fall 2023"
            },
            {
                "title": "Natural Language Processing",
                "date": "Fall 2023"
            },
            {
                "title": "Advanced Digital Logic",
                "date": "Spring 2023"
            },
            {
                "title": "Advanced Circuits",
                "date": "Spring 2023"
            },
            {
                "title": "Probability & Statistics",
                "date": "Spring 2023"
            },
            {
                "title": "Object-Oriented Programming",
                "date": "Spring 2023"
            },
            {
                "title": "Engineering Ethics",
                "date": "Spring 2023"
            },
            {
                "title": "Numerical Methods",
                "date": "Spring 2023"
            },
            {
                "title": "Ordinary Differential Equations",
                "date": "Spring 2023"
            },
            {
                "title": "Quantitative Synthetic Biology",
                "date": "Spring 2023"
            },
            {
                "title": "Sustainable Urban Transport Planning",
                "date": "January 2023"
            },
            {
                "title": "Engineering Statics",
                "date": "Fall 2022"
            },
            {
                "title": "Conservation Laws",
                "date": "Fall 2022"
            },
            {
                "title": "Digital Logic",
                "date": "Fall 2022"
            },
            {
                "title": "Circuits",
                "date": "Fall 2022"
            },
            {
                "title": "Life in the Universe",
                "date": "Fall 2022"
            },
            {
                "title": "Number Theory & Cryptography",
                "date": "Fall 2022"
            },
            {
                "title": "Discrete Mathematics",
                "date": "Spring 2022"
            },
            {
                "title": "Manus et Machina",
                "date": "Spring 2022"
            },
            {
                "title": "Linear Algebra",
                "date": "Spring 2022"
            },
            {
                "title": "World of Babel",
                "date": "Spring 2022"
            },
            {
                "title": "Design & Innovation",
                "date": "January 2022"
            },
            {
                "title": "Foundations of Science",
                "date": "Fall 2021"
            },
            {
                "title": "Computer Programming for Engineers",
                "date": "Fall 2021"
            },
            {
                "title": "Multivariable Calculus",
                "date": "Fall 2021"
            },
        ]
    }
}