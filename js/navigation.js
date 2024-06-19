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

function main() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

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

data = {
    "paths": {
        "Home": "index.html",
        "Projects": "projects.html",
        "Courses": "courses.html",
        "Experience": "experience.html",
        "Community": "projects.html"
    }
}

main();