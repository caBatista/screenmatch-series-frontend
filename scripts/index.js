import getData from "./getData.js";

// Mapeia os elementos DOM que você deseja atualizar
const elements = {
    top5: document.querySelector('[data-name="top5"]'),
    latest: document.querySelector('[data-name="latest"]'),
    series: document.querySelector('[data-name="series"]')
};

// Função para criar a lista de filmes
function createSeriesList(element, dados) {
    // Verifique se há um elemento <ul> dentro da seção
    const existingUl = element.querySelector('ul');

    // Se um elemento <ul> já existe dentro da seção, remova-o
    if (existingUl) {
        element.removeChild(existingUl);
    }

    const ul = document.createElement('ul');
    ul.className = 'lista';
    const listaHTML = dados.map((filme) => `
        <li>
            <a href="/details.html?id=${filme.id}">
                <img src="${filme.poster}" alt="${filme.titulo}">
            </a>
        </li>
    `).join('');

    ul.innerHTML = listaHTML;
    element.appendChild(ul);
}

// Função genérica para tratamento de erros
function handleError(errorMessage) {
    console.error(errorMessage);
}

const categorySelect = document.querySelector('[data-categories]');
const sectionsToHide = document.querySelectorAll('.section'); // Adicione a classe CSS 'hide-when-filtered' às seções e títulos que deseja ocultar.

categorySelect.addEventListener('change', function () {
    const category = document.querySelector('[data-name="categories"]');
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
        // Faça uma solicitação para o endpoint com a categoria selecionada
        getData(`/series/categories/${selectedCategory}`)
            .then(data => {
                createSeriesList(category, data);
            })
            .catch(error => {
                handleError("An error occurred while loading the category data.");
            });
    }
});

// Array de URLs para as solicitações
generateSeries();
function generateSeries() {
    const urls = ['/series/top5', '/series/latest', '/series'];

    // Faz todas as solicitações em paralelo
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
