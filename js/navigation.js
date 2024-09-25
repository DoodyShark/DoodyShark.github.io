document.addEventListener('DOMContentLoaded', main);

async function main() {

    const currentPath = window.location.pathname;
    const page = currentPath.split("/").pop() + window.location.search; 

    const data = await loadFile("./json/navigation.json");

    header = document.querySelector('header');

    const imageLinks = data["imgs_left"].map(([imgPath, path]) => {
        return createElement(
            [
                'li', 
                {},
                [
                    createElement(
                        [
                            'a', {'href': path, }, [
                                createElement([
                                    'img',
                                    {'src': imgPath, "style": "width: 50px; height: 50px; border-radius: 25px"},
                                    []
                                ])
                            ]
                        ]
                    )
                ]
            ]
        )
    })

    const imageLinksRight = data["imgs_right"].map(([imgPath, path]) => {
        return createElement(
            [
                'li', 
                {},
                [
                    createElement(
                        [
                            'a', {'href': path, }, [
                                createElement([
                                    'img',
                                    {'src': imgPath, "style": "width: 50px; height: 50px; border-radius: 25px"},
                                    []
                                ])
                            ]
                        ]
                    )
                ]
            ]
        )
    })

    const links = Object.entries(data["paths"]).map(([title, path]) => {
        if (path === page) {
            return createElement(
                [
                    'li', 
                    {}, 
                    [
                        createElement(
                        [
                            'a', 
                            {'href': path, 'class': 'active'}, 
                            [title]
                        ]
                        )
                    ]
                ]
            )
        }
        return createElement(
            [
                'li', 
                {},
                [
                    createElement(
                        [
                            'a', {'href': path, }, [title]
                        ]
                    )
                ]
            ]
        )
    })

    const nav_div = createElement(
        [
            'div', 
            {class: "navigation navigation-styled"},
            [
                createElement(
                    [
                        'nav', 
                        {}, 
                        [
                            createElement(
                                [
                                    'ul', 
                                    {"style": "padding-right: 100px"}, 
                                    imageLinks.slice()
                                ]
                            ),

                            createElement(
                                [
                                    'ul', 
                                    {}, 
                                    links
                                ]
                            ),

                            createElement(
                                [
                                    'ul', 
                                    {"style": "padding-left: 200px"}, 
                                    imageLinksRight
                                ]
                            )
                        ]
                    ]
                )
            ]
        ]
    )

    header.appendChild(nav_div);
}