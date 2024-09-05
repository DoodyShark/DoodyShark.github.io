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
    const path = window.location.pathname;
    const page = path.split("/").pop();

    data = await loadFile("./json/navigation.json");

    header = document.querySelector('header');
    const lis = Object.entries(data["paths"]).map(([title, path]) => {
        if (path == page) {
            return createElement('li', {}, 
                createElement('a', {'href': path, 'class': 'active'}, title)
            )
        }
        return createElement('li', {},
            createElement('a', {'href': path, }, title)
        )
    })

    const nav_div = createElement('div', {class: "navigation navigation-styled"},
        createElement('nav', {}, 
            createElement('ul', {}, 
                ...lis
            )
        )
    )

    header.appendChild(nav_div);
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