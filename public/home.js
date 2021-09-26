const base_URL = 'https://api.themoviedb.org/3';
const api_key = '?api_key=0bb6bae245d4da7f34903447b12c0209';
const poster_URL = 'https://image.tmdb.org/t/p/original/';

$.ajax(`${base_URL}/genre/movie/list${api_key}`)
    .then(data => {

        $("#genreSelection").append(`<option class="genre" value="0" selected>Please select a genre</option>`)
        $(data.genres).each((index) => {
            $("#genreSelection").append(`<option class="genre" value="${data.genres[index].id}">${data.genres[index].name}</option>`);
        });

        //Display all the popular movies
        getAPIData(`${base_URL}/movie/popular${api_key}`);

        // Events for different inputs (we will load different movie lists based on the filters)
        $('#searchText, #genreSelection').on("input", (e) => {
            e.preventDefault();

            // values for our search inputs
            const searchText = $('#searchText').val();
            const genre = $("#genreSelection").val();

            // conditions for search filters
            const isTextFound = searchText !== '';
            const isGenreDefined = genre !== '0';


            // situations where we need to use different ajax requests
            if (isTextFound && isGenreDefined) {
                console.log("inside both filters")
                console.log(e)
                getAPIData(`${base_URL}/discover/keyword${api_key}&query=${searchText}&with_genres=${genre}`);
            } else if (isTextFound && !isGenreDefined) {
                console.log("inside text search")
                getAPIData(`${base_URL}/search/movie/${api_key}&query=${searchText}`);
                console.log("inside text search2")
            } else if (!isTextFound && isGenreDefined) {
                console.log("inside genre search")
                getAPIData(`${base_URL}/discover/movie${api_key}&with_genres=${genre}`);
                console.log("inside genre search2")
            } else {
                console.log("inside genre search")
                getAPIData(`${base_URL}/movie/popular${api_key}`);
            }

        });

})

// Function to generate a list of 20 movies basedd on search criterias
const getAPIData = function (ajaxRequest) { 
    $.ajax(ajaxRequest)
            .then(data => {

            // empty the div before displaying search results
            $(".film-list").empty();

            // adding a line into the table for each movie
            for (let film of data.results) {
                let newFilm = $(`<tr>
                    <th scope="col"> <img src='${poster_URL}${film.poster_path}' style="width: 50px">  </th>
                    <td>${film.title}</td>
                    <td><i class="material-icons">star</i> <strong>9.2</strong></td>
                    <td><i class="material-icons">star_outline</i></td>
                    <td><a href="${film.id}"><i class="material-icons">info</i></a></td>
                </tr>`);
                $(".film-list").append(newFilm)
            }
        });
 }