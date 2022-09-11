import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";


// https://www.omdbapi.com/?apikey=c85e8068&s=...

function MovieListPage() {

    const [searchTerm, setSearchTerm] = useState("")
    const [movies, setMovies] = useState([])
    const [noMoviesFound, setNoMoviesFound] = useState(false)

    // useEffect runs whenever MovieListPage component is loaded (basically whenever '/' homepage is requested). Whenever that's done, and a previous search was already made (and its parameters were saved into localStorage), fetch that searched term again from the API. An empty dependency array is provided, because you don't want to run useEffect's function at arg1 every time state/props are getting updated, you only want to load the previous results before making any new request. If you didn't make it run only once, you'd get a flicker any time you searched for a movie title because componentDidUpdate would be triggered
    useEffect(() => {
        let term = localStorage.getItem("searchTerm")
        if (term) {
            fetchMovieTitles(term)
        }
    }, [])

    const handleSearchTermChange = (e) => {
        // make the searchTerm value the one from the element that got the 'e' triggered on it- in this case the value from the <input>
        setSearchTerm(e.target.value)
    }

    const clearResults = () => {
        setMovies([])
        setSearchTerm("")
        localStorage.removeItem("searchTerm")
    }

    const fetchMovieTitles = (movieTitle) => {
        const url = `https://www.omdbapi.com/?apikey=c85e8068&s=${movieTitle}`

        // saving searched title, the one also passed to fetch API, to the local storage
        localStorage.setItem("searchTerm", movieTitle)

        fetch(url)
            .then(response => response.json())
            .then(result => {
                // Error is non-null only when there are no search results
                if (result.Error) {
                    setMovies([])
                    setNoMoviesFound(true)
                } else {
                    setMovies(result.Search)
                    setNoMoviesFound(false)
                }
            })
    }

    // html tags in react are not closed the same way as in pure html: <img src=... /> instead of <img src=..>sth</img>

    const allMovies = movies.map(movie => {
        return (
            <div key={movie.imdbID}>
                <div class="col">
                    <div class="card shadow-sm">
                        <img class="bd-placeholder-img card-img-top" src={movie.Poster === "N/A" ? "/movie_alt_pic.jpg" : movie.Poster} alt={movie.imdbID} />
                        <div class="card-body">
                            <h3>{movie.Title}</h3>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <NavLink to={`${movie.imdbID}`}>
                                        <button class="btn btn-sm btn-outline-secondary">Details</button>
                                    </NavLink>
                                </div>
                                <small class="text-muted">{movie.Year}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div>
            <section class="py-5 text-center container">
                <div class="row py-lg-5">
                    <div class="col-lg-6 col-md-8 mx-auto">
                        <h1 class="fw-light">Movie Search</h1>
                        <p class="lead text-muted">Look for any movie with our engine</p>
                        <p>
                            <input type="text" name="movie" onChange={handleSearchTermChange} placeholder="Your movie title" />
                        </p>
                        <p>
                            <button onClick={() => fetchMovieTitles(searchTerm)} class="btn btn-primary my-2 me-2"> Search</button>
                            <button onClick={clearResults} class="btn btn-secondary my-2"> Clear results</button>
                        </p>
                        {/* Need to make a function inside onClick, as you want to fire fetchMovie only when the button is clicked, otherwise it would be done any time the screen is refreshed */}
                    </div>
                </div>
            </section>

            <div class="album py-5 bg-light">
                <div class="container">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {allMovies}
                    </div>
                </div>
            </div>

            {noMoviesFound ? <h3>No movies found</h3> : null}

        </div>
    )
}

// order: 1) A value is passed to input field - it's pulled with handleSearchTermChange;  2) Search button is clicked which triggers fetchMovieTitle(ValueFromStep1);  3) fetchMovieTitle(ValueFromStep1) creates a url from the argument passed and runs fetch(url), the result of API's reponse is logged into console;  4) populate the results into state key "movies" (state is 'object of a set of observable properties that control the behavior of the component')

// * split totally unrelated pieces of state into multiple useStates with their own setFunctions, instead of having all of them under one useState({key1:val1, key2:val2, ...});  ** initial value of UseState can be various types - numbers, strings, arrays, objects,... ;   *** whenever any piece of state is changed with setSomething, the whole return() is being re-rendered


// localStorage - part of JS. It's a key:value storage in the browser theat enables to save data from previous requests (useful with page refreshes, reopening the browser etc.). Items in the localStorage are accessible from any page

export default MovieListPage
