
function createElement(arr) {
    if (arr === null) {
        return;
    }

    [type, attrs, children] = arr;

    // console.log(arr);
    // console.log(`Type ${type}`);
    // console.log(`Attrs ${attrs}`);
    // console.log(`Children ${children}`);

    const ele = document.createElement(type);

    // add element attributes
    for (const prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        ele.setAttribute(prop, attrs[prop]);
      }
    }
  
    if (children) {
        // console.log(`Here ${children}`)
        // add child nodes to element
        children.forEach(c => {
            c && ele.appendChild( typeof c === 'string' ? document.createTextNode(c) : c.constructor === Array? createElement(c): c)
        } );
    }
    
    return ele;
}
