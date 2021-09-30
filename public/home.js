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
            getDataFromAPI(`${base_URL}/search/movie/${api_key}&query=${searchTextValue}`)

        } else if (!isTextFound && isGenreDefined) {

            //Display movies based on the genre selection
            getDataFromAPI(`${base_URL}/discover/movie${api_key}&with_genres=${e.target.value}`)

        } else {       
            //  if both filters are selected we will be getting API be search text and filtering in the browser

            $.ajax(`${base_URL}/search/movie/${api_key}&query=${searchTextValue}`)
            .then(data => {
                    
                // empty the table before adding movie results
                $(".film-list").empty()
                
                const results = data.results;

                // generating movie tables
                results.forEach((film, index) => {


                    film.genre_ids.forEach(i => {

                        // only display movies if genre-id of movie is equal to the value in our genre dropdown
                        if (i === Number(genreValue)) {

                            // getting data from backend on the user ratings
                            $.ajax('/api').then(allRatings => {

                                // if user exists in the system, we generate DOM this way (with user rating column)
                                if (user !== 0) {
                                    // Start from getting average rating for movies where possible

                                    // using function below to generate average rating and number of votes
                                    const average = getAverageRating(allRatings.ratings, film);

                                    // if user has rated the movie, we want to display that user rating
                                    allRatings.ratings.forEach((rating) => {

                                        // displaying user rating for the movies which have rating in our database
                                        if (film.id === rating.movie_id && rating.users_id === user) {
                                            showRowWithData(film, average.averageRatingForEachMovie, average.numberOfVotes, rating.rating);
                                        } 
                                    });
                                    
                                    // now we load the rest of the movies (so the ones with rating don't double up)
                                    if ($(`.movie-title:eq(${index})`).text() !== film.title) {

                                        // movies without user rating will have "?" or "not rated" as a text (still deciding)
                                        showRowWithData(film, average.averageRatingForEachMovie, average.numberOfVotes, 'not rated');
                                    }

                                } else {

                                    const average = getAverageRating(allRatings.ratings, film);
                                    // for users which are not logged in we have a different display (no need to show user rating)
                                    showRowWithData(film, average.averageRatingForEachMovie, average.numberOfVotes, 'N/A');
                                }
                            })
                            .catch((err) => {
                                alert(`You messed something up: ${err}`);
                            });  
                        }
                    })
                })
                    
                        
            })
        }
    })
})

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

                        // using function below to generate average rating and number of votes
                        const average = getAverageRating(allRatings.ratings, film);

                        // if user has rated the movie, we want to display that user rating
                        allRatings.ratings.forEach((rating) => {

                            // displaying user rating for the movies which have rating in our database
                            if (film.id === rating.movie_id && rating.users_id === user) {
                                showRowWithData(film, average.averageRatingForEachMovie, average.numberOfVotes, rating.rating);
                            } 
                        });
                        
                        // now we load the rest of the movies (so the ones with rating don't double up)
                        if ($(`.movie-title:eq(${index})`).text() !== film.title) {

                            // movies without user rating will have "?" or "not rated" as a text (still deciding)
                            showRowWithData(film, average.averageRatingForEachMovie, average.numberOfVotes, 'not rated');
                        }

                    } else {

                        const average = getAverageRating(allRatings.ratings, film);

                        // for users which are not logged in we have a different display (no need to show user rating)
                        showRowWithData(film, average.averageRatingForEachMovie, average.numberOfVotes, 'N/A');
                    }
                })
                .catch((err) => {
                    alert(`You messed something up: ${err}`);
                });      
        })
    });
}

// function to get average rating from an array

const getAverageRating = (ratingsArray, film) => {
    // Filter array of ratings to see if there are multiple ratings for each movie
    const allRatingsForOneMovie = ratingsArray.filter((rating) => {
        return rating.movie_id === film.id;
    })

    // finding an average rating for each movie (if there is one)
    let averageRatingForEachMovie = (allRatingsForOneMovie.length > 0) ? (allRatingsForOneMovie.reduce((r, c) => r + c.rating, 0) / allRatingsForOneMovie.length).toFixed(1) : '?';
    
    // number of votes for each movie
    const numberOfVotes = allRatingsForOneMovie.length;

    // add data to an object so we can return it from the function
    const averageData = {
        averageRatingForEachMovie,
        numberOfVotes
    }

    return averageData;
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