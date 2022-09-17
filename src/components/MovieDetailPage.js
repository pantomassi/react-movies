import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// component for another API call (to a different API url - one retrieving a specific movie's details)

function MovieDetailPage() {

    // useParams returns an object of key/value pairs of URL parameters. Expecting only one here - movie id starting with 'tt
    const movieId = useParams()

    const [movieDetail, setMovieDetail] = useState({})

    // call the first argument function (fetch), and do that only when a parameter from the dependency array (2nd argument) changes. Empty array- called only once upon placing element on the DOM
    useEffect(() => {
        fetchMovieDetailsById(movieId.imdbID)
    }, [])

    // fetch API
    const fetchMovieDetailsById = (movieId) => {
        const url = `https://www.omdbapi.com/?apikey=XXXXXXXX&i=${movieId}`

        fetch(url)
            .then(response => response.json())
            .then(result => {
                setMovieDetail(result)
            })
    }


    return (
        <div class="container">
            <div class="row justify-content-center">
                <div class="col col-lg-6 mt-4">
                    <div class="text-center">
                        <h2>{movieDetail.Title} ({movieDetail.Year})</h2>
                        <img src={movieDetail.Poster} />
                    </div>
                    <table class="table table-hover">
                        <tbody>
                            <tr>
                                <th scope="row">Plot</th>
                                <td><i>{movieDetail.Plot}</i></td>
                            </tr>
                            <tr>
                                <th scope="row">Released</th>
                                <td>{movieDetail.Released}</td>
                            </tr>
                            <tr>
                                <th scope="row">Director</th>
                                <td>{movieDetail.Director}</td>
                            </tr>
                            <tr>
                                <th scope="row">Actors</th>
                                <td>{movieDetail.Actors}</td>
                            </tr>
                            <tr>
                                <th scope="row">Awards</th>
                                <td>{movieDetail.Awards}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// Everything runs as soon as you load the page, no interaction required from the user to load the details, the user can only choose to go back to the list of all movies
// 1) match.params from react v5 doesn't exist anymore - so instead of accessing parent element's (MovieListPage) props, use useParams hook - you get an object with params from the url string. Save the only param (movie id) to movieId;  2) Initialize 'movieDetail' key of state, make it an empty object, it will be populated with details about a specific movie, pulled from API;  3) useEffect is designed to run only once upon loading the DOM (dependency array is empty). It calls fetchMovieDetailsById;  4) fetchMovieDetailsById(idFromStep1) is executed, which fetches data from API as an object, and then populates 'movieDetail' piece of state with the key:value pairs from that API response via setMovieDetail - method to update state properties;  5) DOM elements are rendered based on 'movieDetail' values

export default MovieDetailPage
