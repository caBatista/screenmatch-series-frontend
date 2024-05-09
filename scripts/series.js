import getData from "./getData.js";

const params = new URLSearchParams(window.location.search);
const seriesId = params.get('id');
const seasonsList = document.getElementById('season-select');
const seriesDetails = document.getElementById('season-episodes');
const descriptionCard = document.getElementById('description-card');

// Function to load seasons
function loadSeasons() {
    getData(`/series/${seriesId}/seasons/all`)
        .then(data => {
            const uniqueSeasons = [...new Set(data.map(season => season.season))];
            seasonsList.innerHTML = ''; // Clears existing options

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select the season'
            seasonsList.appendChild(defaultOption); 
           
            uniqueSeasons.forEach(season => {
                const option = document.createElement('option');
                option.value = season;
                option.textContent = season;
                seasonsList.appendChild(option);
            });

            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'All seasons'
            seasonsList.appendChild(allOption); 

            const topEpisodesOption = document.createElement('option');
            topEpisodesOption.value = 'top';
            topEpisodesOption.textContent = 'Top episodes'
            seasonsList.appendChild(topEpisodesOption);
        })
        .catch(error => {
            console.error('Error when getting seasons:', error);
        });
}

// Function to load episodes of a season
function loadEpisodes() {
    var selectedOption = seasonsList.value;
    seriesDetails.innerHTML = '';

    if(selectedOption === 'top') {
        getData(`/series/${seriesId}/top`)
            .then(episodes => {
                const ul = document.createElement('ul');
                ul.className = 'episodes-list';

                const htmlList = episodes.map(episode => `
                        <li>
                            Season ${episode.season} - Episode ${episode.episodeNumber}: ${episode.title} - Rating ${episode.rating}
                        </li>
                    `).join('');

                ul.innerHTML = htmlList;
                const paragrath = document.createElement('p');
                const linha = document.createElement('br');
                paragrath.textContent = `Top 5 episodes:`;
                seriesDetails.appendChild(paragrath);
                seriesDetails.appendChild(linha);
                seriesDetails.appendChild(ul);
            })
            .catch(error => {
                console.error('Error when getting top episodes:', error);
            }
        );
    } else {
        getData(`/series/${seriesId}/seasons/${seasonsList.value}`)
            .then(data => {
                const uniqueSeasons = [...new Set(data.map(season => season.season))];
                 
                uniqueSeasons.forEach(season => {
                    const ul = document.createElement('ul');
                    ul.className = 'episodes-list';

                    const currentEpisodes = data.filter(series => series.season === season);

                    const htmlList = currentEpisodes.map(series => `
                        <li>
                            ${series.episodeNumber} - ${series.title}
                        </li>
                    `).join('');
                    ul.innerHTML = htmlList;
                    
                    const paragrath = document.createElement('p');
                    const linha = document.createElement('br');
                    paragrath.textContent = `Season ${season}`;
                    seriesDetails.appendChild(paragrath);
                    seriesDetails.appendChild(linha);
                    seriesDetails.appendChild(ul);
                });
            })
            .catch(error => {
                console.error('Error when getting episodes:', error);
            }
        );
    }
}

// Function to load series information
function loadSeriesInfo() {
    getData(`/series/${seriesId}`)
        .then(data => {
            descriptionCard.innerHTML = `
                <img src="${data.poster}" alt="${data.title}" />
                <div>
                    <h2>${data.title}</h2>
                    <div class="description-card">
                        <p><b>Rating:</b> ${data.rating}</p>
                        <p><b>Genre:</b> ${data.genre}</p>
                        <p>${data.plot}</p>
                        <p><b>Cast:</b> ${data.actors}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao obter informações da série:', error);
        });
}

// Add the event listener to the seasons select
seasonsList.addEventListener('change', loadEpisodes);

// Load the series information, seasons and episodes
loadSeriesInfo();
loadSeasons();
