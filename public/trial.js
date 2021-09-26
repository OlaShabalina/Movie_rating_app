const base_URL = 'https://api.themoviedb.org/3';
const api_key = '?api_key=0bb6bae245d4da7f34903447b12c0209';
const poster_URL = 'https://image.tmdb.org/t/p/original/';

$.ajax(`${base_URL}/genre/movie/list${api_key}`)
    .then(data => {

        //  code to generate a dropdown with existing genres
        $("#genreSelection").append(`<option class="genre" value="0" selected>Please select a genre</option>`)
        $(data.genres).each((index) => {
            $("#genreSelection").append(`<option class="genre" value="${data.genres[index].id}">${data.genres[index].name}</option>`);
        });


        const textSearchValue = $("#searchText").val();
        const genreSelectionValue = $("#genreSelection").val();

        if (genreSelectionValue !== "0" && textSearchValue !== '') {

            $("#genreSelection").empty();

            $.when($.get('1.json'), $.get('2.json')).then(function(r1, r2){
                console.log(r1[0].message + " " + r2[0].message);
             });
        
        } else if (genreSelectionValue === "0" && textSearchValue !== '') {

            $("#genreSelection").empty();

        // c
        $('#searchText').on("input", function (e) {
            e.preventDefault();
            const searchTextValue = $(this).val();
            console.log(searchTextValue);

            $.ajax(`${base_URL}/search/movie/${api_key}&query=${searchTextValue}`)
                .then(data => {

                    console.log(data)

                    for (let film of data.results) {
                        console.log(film)
                        let newFilm = $("<tr>")
                        newFilm.append(`
                            <th scope="col"> <img src='${poster_URL}${film.poster_path}' style="width: 50px">  </th>
                            <td>${film.title}</td>
                            <td><i class="material-icons">star</i> <strong>9.2</strong></td>
                            <td><i class="material-icons">star_outline</i></td>
                            <td><a href="${film.id}"><i class="material-icons">info</i></a></td>`);
                        $(".film-list").append(newFilm)
                    }
                });

            });

        } else if (genreSelectionValue !== "0" && textSearchValue === '') {

            $("#genreSelection").empty();

            $("#genreSelection").on("change", function (e) {
                e.preventDefault();
                
                $.ajax(`${base_URL}/discover/movie${api_key}&with_genres=${e.target.value}`) 
                    .then(data => {

                        for (let film of data.results) {
                            console.log(film)
                            let newFilm = $("<tr>")
                            newFilm.append(`
                                <th scope="col"> <img src='${poster_URL}${film.poster_path}' style="width: 50px">  </th>
                                <td>${film.title}</td>
                                <td><i class="material-icons">star</i> <strong>9.2</strong></td>
                                <td><i class="material-icons">star_outline</i></td>
                                <td><a href="${film.id}"><i class="material-icons">info</i></a></td>`);
                            $(".film-list").append(newFilm)
                        }
                });

            });
        } else if (genreSelectionValue === "0" && textSearchValue === '') {

            $("#genreSelection").empty();

            // if no filters are selected, we will show the list of popular movies in any genre
            $.ajax(`${base_URL}/movie/popular${api_key}`)
                .then(data => {

                for (let film of data.results) {

                    let newFilm = $("<tr>")
                    newFilm.append(`
                        <th scope="col"> <img src='${poster_URL}${film.poster_path}' style="width: 50px">  </th>
                        <td>${film.title}</td>
                        <td><i class="material-icons">star</i> <strong>9.2</strong></td>
                        <td><i class="material-icons">star_outline</i></td>
                        <td><a href="${film.id}"><i class="material-icons">info</i></a></td>`);
                    $(".film-list").append(newFilm)
                }

        })
            
        }

        
    })