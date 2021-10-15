console.log(movieId)

const base_URL = 'https://api.themoviedb.org/3';
const api_key = '?api_key=0bb6bae245d4da7f34903447b12c0209';
const poster_URL = 'https://image.tmdb.org/t/p/original/';

// Select and add poster

console.log(movieId)

$.ajax(`${base_URL}/movie/${movieId}${api_key}`)
    .then( function (movie) {

        // request poster API and add it to the page
        $(".movie-poster").append(`<img src="${poster_URL}${movie.poster_path}" style="width: 100%" alt="">`);

        // request title, year, synopsis
        generateDOMElfromAPI(movie.title, "Movie title");
        generateDOMElfromAPI(movie.overview, "Synopsis");

    })
    .catch((err) => console.log(err))


const generateDOMElfromAPI = (elementAPI, label) => {
    $(".movie-info").append(`
        <p class="card-header">${label}</p>
        <p class="ps-3 mt-2"> ${elementAPI} </p>
    `);
}