const base_URL = 'https://api.themoviedb.org/3';
const api_key = '?api_key=0bb6bae245d4da7f34903447b12c0209';
const poster_URL = 'https://image.tmdb.org/t/p/original/';

//Display all the genre from the api
$.ajax(`${base_URL}/genre/movie/list${api_key}`)
    .then(data => {

        // Generating data drop-down for the movie genres
    $("#genreSelection").append(`<option class="genre" value="0">Please select a genre</option>`)
    $(data.genres).each((index) => {
    $("#genreSelection").append(`<option class="genre" value="${data.genres[index].id}">${data.genres[index].name}</option>`);
    });

        // without selecing filters, user will see 20 most popular movies (we will be using function below to display them)
        getDataFromAPI(`${base_URL}/movie/popular${api_key}`)

    // Events for different inputs (we will load different movie lists based on the filters)
    $('#searchText, #genreSelection').on("input", (e) => {
        e.preventDefault();

        // values from inputs
        const searchTextValue = $('#searchText').val();
        const genreValue = $("#genreSelection").val();

        // Conditions for applying filters and getting movies from API
        const isTextFound = searchTextValue !== '';
        const isGenreDefined = genreValue !== '0';

        if (!isTextFound && !isGenreDefined) {

            //Display all the popular movies
            getDataFromAPI(`${base_URL}/movie/popular${api_key}`)
            
        } else if (isTextFound && !isGenreDefined) {
        
            //Display movies based on the search text box
            const searchTextValue = $('#searchText').val();
            getDataFromAPI(`${base_URL}/search/movie/${api_key}&query=${searchTextValue}`)

        } else if (!isTextFound && isGenreDefined) {

            //Display movies based on the genre selection
            getDataFromAPI(`${base_URL}/discover/movie${api_key}&with_genres=${e.target.value}`)

        } else {       
            //  if both filters are selected we will be getting API be search text and filtering in the browser

            // empty the table before adding movie results
        $(".film-list").empty()
        
        const results = data.results;

        // generating movie tables
        results.forEach((film, index) => {
            
            // if user exists in the system, we generate DOM this way (with user rating column)
            if (user !== 0) {
                
                // getting data from backend on the user ratings
                $.ajax('/api').then(logedInUserReviews => {
                    logedInUserReviews.userRatings.forEach(userRating => {

                        // displaying user rating for the movies which have rating in our database
                        if (film.id === userRating.movie_id) {
                            showRowWithData(film, '1', '20', userRating.rating);
                        } 
                    });
                    
                    // now we load the rest of the movies (so the ones with rating don't double up)
                    if ($(`.movie-title:eq(${index})`).text() !== film.title) {

                        // movies without user rating will have "?" as a text
                        showRowWithData(film, '1', '20', '?');
                    }
                })
                .catch(err => console.log(err));
                
            } else {
                // for users which are not logged in we have a different display (no need to show user rating)
                showRowWithData(film, averageRating, usersVoted, 'NA');
            }    
                
        })
            
            // Yet to introduce filter by genre 
            // // Can't use the same function as this even requires filter after API request
            // $(".film-list").empty()

            // $.ajax(`${base_URL}/search/movie/${api_key}&query=${searchTextValue}`)
            //     .then(data => {

            //     for (let film of data.results) {

            //         film.genre_ids.forEach(i =>{

            //             if(i === Number(genreValue)) {
            //             showRowWithData(film, 1, 20, 'NA')
            //             }
            //         }) 
            //     }

            // });
        }
    })
}) 

const usersVoted = 20;
const averageRating = 20;

// Function to generate movie DOM using ajax request
const getDataFromAPI = (ajaxRequest) => {
    $.ajax(ajaxRequest)
    .then(data => {
        
        // empty the table before adding movie results
        $(".film-list").empty()
        
        const results = data.results;

        // generating movie tables
        results.forEach((film, index) => {
            
            // getting data from backend on the user ratings
            $.ajax('/api').then(allRatings => {

                // if user exists in the system, we generate DOM this way (with user rating column)
                if (user !== 0) {

                    // Start from getting average rating for movies where possible
                    // Filter array of ratings to see if there are multiple ratings for each movie
                    const allRatingsForOneMovie = allRatings.ratings.filter((rating) => {
                        return rating.movie_id === film.id;
                    })

                    // fining average from filtered array
                    const averageRatingForEachMovie = allRatingsForOneMovie.reduce((r, c) => r + c.rating, 0) / allRatingsForOneMovie.length;
                    // since not all movies have ratings, we show NA for movies that don't have it
                    const isAverageExists = (averageRatingForEachMovie) ? averageRatingForEachMovie : '';
                    // number is votes for each movie
                    const numberOfVotes = allRatingsForOneMovie.length;
                    
                    // if user has rated the movie, we want to display that user rating
                    allRatings.ratings.forEach((rating) => {

                        // displaying user rating for the movies which have rating in our database
                        if (film.id === rating.movie_id && rating.users_id === user) {
                            showRowWithData(film, isAverageExists, numberOfVotes, rating.rating);
                        } 
                    });
                    
                    // now we load the rest of the movies (so the ones with rating don't double up)
                    if ($(`.movie-title:eq(${index})`).text() !== film.title) {

                        // movies without user rating will have "?" or "not rated" as a text (still deciding)
                        showRowWithData(film, isAverageExists, numberOfVotes, 'not rated');
                    }

                } else {

                    const allRatingsForOneMovie = allRatings.ratings.filter((rating) => {
                        return rating.movie_id === film.id;
                    })

                    // fining average from filtered array
                    const averageRatingForEachMovie = allRatingsForOneMovie.reduce((r, c) => r + c.rating, 0) / allRatingsForOneMovie.length;
                    // since not all movies have ratings, we show NA for movies that don't have it
                    const isAverageExists = (averageRatingForEachMovie) ? averageRatingForEachMovie : '';
                    // number is votes for each movie
                    const numberOfVotes = allRatingsForOneMovie.length;

                    // for users which are not logged in we have a different display (no need to show user rating)
                    showRowWithData(film, isAverageExists, numberOfVotes, 'N/A');
                }
            })
            .catch(err => console.log(err));
                
        })
    });
}

// function to generate each row
const showRowWithData = (film, averageRating, usersVoted, yourVote) => {
    let newFilm = $(`<tr>
        <th scope="col"> <img src='${poster_URL}${film.poster_path}' style="width: 50px">  </th>
        <td class="movie-title">${film.title}</td>
        <td><i class="material-icons">star</i> <strong>${averageRating}</strong>(${usersVoted})</td>
        <td><i class="material-icons">star</i>${yourVote}</td>
        <td><a href="${film.id}"><i class="material-icons">info</i></a></td>
        </tr>`)
    $(".film-list").append(newFilm);
}