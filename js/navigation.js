document.addEventListener('DOMContentLoaded', main);

async function main() {

    const currentPath = window.location.pathname;
    const page = currentPath.split("/").pop() + window.location.search; 

    const data = await loadFile("./json/navigation.json");

    header = document.querySelector('header');
    const lis = Object.entries(data["paths"]).map(([title, path]) => {
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
                                    {}, 
                                    lis
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