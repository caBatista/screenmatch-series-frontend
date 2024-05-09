import getData from "./getData.js";

// Maps the DOM elements to variables
const elements = {
    top5: document.querySelector('[data-name="top5"]'),
    latest: document.querySelector('[data-name="latest"]'),
    series: document.querySelector('[data-name="series"]')
};

// Function to create the series list
function createSeriesList(element, data) {
    // Check if there is an existing <ul> element inside the section
    const existingUl = element.querySelector('ul');

    // If there is, remove it
    if (existingUl) {
        element.removeChild(existingUl);
    }

    const ul = document.createElement('ul');
    ul.className = 'list';
    const htmlList = data.map((filme) => `
        <li>
            <a href="/details.html?id=${filme.id}">
                <img src="${filme.poster}" alt="${filme.titulo}">
            </a>
        </li>
    `).join('');

    ul.innerHTML = htmlList;
    element.appendChild(ul);
}

// Generic function to handle errors
function handleError(errorMessage) {
    console.error(errorMessage);
}

const categorySelect = document.querySelector('[data-categories]');
const sectionsToHide = document.querySelectorAll('.section'); // Add the class 'hidden' to hide the sections

categorySelect.addEventListener('change', function () {
    const category = document.querySelector('[data-name="category"]');
    const selectedCategory = categorySelect.value;

    if (selectedCategory === 'all') {

        for (const section of sectionsToHide) {
            section.classList.remove('hidden')
        }
        category.classList.add('hidden');

    } else {

        for (const section of sectionsToHide) {
            section.classList.add('hidden')
        }

        category.classList.remove('hidden')
        // Make the request to get the series of the selected category
        getData(`/series/categories/${selectedCategory}`)
            .then(data => {
                if (Array.isArray(data)) {
                    createSeriesList(category, data);
                } else {
                    console.error('Expected array but received:', data);
                }
            })
            .catch(error => {
                handleError("An error occurred while loading the category data.");
            });
    }
});

// Function to generate the series
generateSeries();
function generateSeries() {
    const urls = ['/series/top5', '/series/latest', '/series'];

    // Make the requests parallelly
    Promise.all(urls.map(url => getData(url)))
        .then(data => {
            createSeriesList(elements.top5, data[0]);
            createSeriesList(elements.latest, data[1]);
            createSeriesList(elements.series, data[2].slice(0, 5));
        })
        .catch(error => {
            handleError("An error occurred while loading the data.");
        });

}
